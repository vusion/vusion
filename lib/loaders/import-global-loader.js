const fs = require('fs');
const path = require('path');

module.exports = function (content) {
    this.cacheable();

    const outputs = [content];
    const config = global.vusionConfig;

    // Import global.css
    const globalPath = path.resolve(process.cwd(), config.globalCSSPath);
    let relativePath = path.relative(path.dirname(this.resourcePath), globalPath);
    if (!path.isAbsolute(relativePath))
        relativePath = './' + relativePath;
    this.addDependency(globalPath);
    if (fs.existsSync(globalPath))
        outputs.unshift(`@import '${relativePath}';`);

    // Import theme css
    if (config.theme) {
        const srcIndex = this.resourcePath.lastIndexOf('/src/');
        if (~srcIndex) {
            const themePath = this.resourcePath.slice(0, srcIndex) + `/theme-${config.theme}/` + this.resourcePath.slice(srcIndex + 5);
            if (fs.existsSync(themePath)) {
                this.addDependency(themePath);
                // @TODO: postcss-import follow spec: `@import` statements must precede all other statements
                // outputs.push(`@import '${themePath}';`);
                outputs.push(fs.readFileSync(themePath, 'utf8').replace(/@import .+?\n/, ''));
            }
        }
    }

    return outputs.join('\n');
};
