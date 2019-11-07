'use strict';

const HARMONY_IMPORT = 'harmony import'; // corresponding to import statement, e.g import ** as yyy from 'xxx'; or import 'zzz';
const HARMONY_IMPORT_SPECIFIER_TYPE = 'harmony import specifier'; // corresponding to import default from 'xxx';
const HARMONY_EXPORT_IMPORTED_SPECIFIER_TYPE = 'harmony export imported specifier'; // export what has been imported bofore;
const CJS_REQUIRE = 'cjs require';
const toBeRemovedResources = [];
let unDeadModuleNames = [];
let unDeadLibModules;
let targetModule;
let unDeadStyles;

class VusionTreeShakingPlugin {
    constructor(options) {
        this.options = Object.assign({
            shakingPath: './r',
            whiteList: [''],
        }, options);
    }

    apply(compiler) {
        compiler.plugin('this-compilation', (compilation) => {
            compilation.plugin('optimize-chunks', (chunks) => {
                chunks.forEach((chunk) => {
                    const modules = chunk.mapModules();
                    const target = this.options.shakingPath;
                    const entryModule = chunk.entryModule;
                    targetModule = modules.find((e) => e.rawRequest === target);

                    this.markModuleUnDead(entryModule);
                    if (!targetModule)
                        return;

                    // gathering indead imported module from reasons
                    targetModule.reasons.forEach((reason) => {
                        reason.module.dependencies.forEach((dep) => {
                            if ((dep.type === HARMONY_IMPORT_SPECIFIER_TYPE || dep.type === HARMONY_EXPORT_IMPORTED_SPECIFIER_TYPE) && dep.importDependency.request === this.options.shakingPath && dep.id)
                                unDeadModuleNames.push(dep.id);
                        });
                    });
                    unDeadModuleNames = [...new Set(unDeadModuleNames)];

                    unDeadLibModules = this.findUndeadModules(targetModule);
                    this.analyzeUnDeadLibModules(unDeadLibModules, compilation);
                    unDeadLibModules = [...unDeadLibModules.values()];
                    this.findUndeadStyles(unDeadLibModules);
                    unDeadLibModules.forEach((module) => this.markModuleUnDead(module));
                    targetModule.isUnDead = true;

                    this.markModuleNeedToBeRemoved(targetModule);
                    chunk.mapModules((c) => c).forEach((module) => {
                        if (toBeRemovedResources.includes(module.resource)) {
                            module.removeChunk(chunk);
                        }
                    });
                });
            });
            compilation.plugin('optimize-module-ids', (modules) => {
                if (!targetModule)
                    return;
                // set unused module's id to undead module id
                const undeadId = modules.find((module) => module.isUnDead).id;
                modules.forEach((module) => {
                    const resource = (module.rootModule && module.rootModule.resource || module.resource);
                    if (toBeRemovedResources.includes(resource))
                        module.id = undeadId;
                });
            });
        });
    }

    findUndeadModules(module, modulesMap = new Map()) {
        module.dependencies.forEach((m) => {
            if (m.type === HARMONY_EXPORT_IMPORTED_SPECIFIER_TYPE && m.id === null && m.name === null) { // export * from 'xxx'
                m.importDependency.module.isUnDead = true;
                this.findUndeadModules(m.importDependency.module, modulesMap);
            }
        });
        module.dependencies.forEach((dep, i, deps) => {
            if (dep.type === HARMONY_EXPORT_IMPORTED_SPECIFIER_TYPE && (!unDeadModuleNames.length || unDeadModuleNames.includes(dep.name)))
                modulesMap.set(dep.name, dep.importDependency.module);
            else if (dep.type === HARMONY_IMPORT && !deps.map((dep) => dep.importDependency).filter(Boolean).includes(dep)) // just import 'xxx' without export
                modulesMap.set(dep.module.resource, dep.module);
            return undefined;
        });

        // using map to support overwriting module with same name
        return modulesMap;
    }

    findUndeadStyles(modules) {
        unDeadStyles = modules.map((m) => {
            const styleModuleDep = m.dependencies.find((d) => d.type === CJS_REQUIRE && d.request.includes('extract-text'));
            let styleModuleResource;
            if (styleModuleDep && (styleModuleResource = styleModuleDep.module.resource).includes('node_modules'))
                return styleModuleResource;
            return '';
        }).filter(Boolean);
    }

    markModuleUnDead(module, depth = 0) {
        depth++;
        if (!module || module.isUnDead || module.rawRequest === this.options.shakingPath)
            return;
        const hasImportDep = module.dependencies.some((m) => !!m.module);
        const resource = module.resource || '';
        module.isUnDead = true;

        // dependency depth > 3 means the style of module depend on its parent styles, we should remove its parent styles if they are dead
        if (depth > 3 && resource.endsWith('.css') && resource.includes('node_modules') && unDeadStyles && !unDeadStyles.includes(resource))
            module.isUnDead = false;
        if (hasImportDep) {
            module.dependencies.forEach((dep) => {
                if (!dep.module)
                    return;
                this.markModuleUnDead(dep.module, depth);
            });
        }
    }

    markModuleNeedToBeRemoved(module) {
        const hasImportDep = module.dependencies.some((m) => m.type.includes('import') || m.type.includes(CJS_REQUIRE));

        module.dependencies.forEach((m) => {
            if (m.type === HARMONY_EXPORT_IMPORTED_SPECIFIER_TYPE && m.id === null)
                this.markModuleNeedToBeRemoved(m.importDependency.module);
        });

        if (hasImportDep) {
            module.dependencies.forEach((dep) => {
                if (!dep.module || this.options.whiteList.includes(dep.request))
                    return;
                if (!dep.module.isUnDead && !toBeRemovedResources.includes(dep.module.resource))
                    toBeRemovedResources.push(dep.module.resource);
                this.markModuleNeedToBeRemoved(dep.module);
            });
        }
    }
    // find implicit component tag names and prompt user to import if these compoenents are not imported previously
    analyzeUnDeadLibModules(libModulesMaps, compilation) {
        const moduleInfo = [];
        const implicitTagNameRegx = /_c\(('|")(u-.+?)\1/;
        const camelRegx = /^[A-Z]/;
        const formatCamel = (m, p1) => '-' + p1.toLowerCase();
        libModulesMaps.forEach((module, key) => {
            const infoObj = {
                tagName: key && key.match(camelRegx) ? 'u' + key.replace(/([A-Z])/g, formatCamel) : '', // change CamelCase to 'u-camel-case'
                implictTags: [],
            };
            module.dependencies.forEach((dep) => {
                if (dep.type === HARMONY_IMPORT) {
                    const source = dep.module.originalSource();
                    const request = dep.request;
                    if (request.endsWith('.html') || request.endsWith('.vue') && request.includes('type=template')) {
                        const match = source._value.match(implicitTagNameRegx);
                        if (match)
                            infoObj.implictTags.push(match[2]);
                    }
                }
            });
            moduleInfo.push(infoObj);
        });
        const tagNames = moduleInfo.map((info) => info.tagName);
        moduleInfo.forEach((info, i) => {
            info.implictTags.length && info.implictTags.forEach((tag) => !tagNames.includes(tag) && compilation.errors.push(new Error(`vusion build: you should import ${tag} as well`)));
        });
    }
}

module.exports = VusionTreeShakingPlugin;
