'use strict';

const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const { EXTEND_START, EXTEND_END, IMPORT_START, IMPORT_END } = require('./DIVIDERS');
const vueCSSPathRE = /\.vue([\\/]module\.css)?$/i;

const { VueExtendTree } = require('vue-component-analyzer/src/VueExtendTree');
const vueExtendTree = new VueExtendTree();

function addMark(styles, rule, start, end) {
    styles.insertBefore(rule, { text: start });
    styles.insertAfter(rule, { text: end });
}

function findSuperByCSSPath(cssPath, loader) {
    let jsPath;
    if (cssPath.endsWith(`.vue${path.sep}module.css`))
        jsPath = path.join(cssPath, '../index.js');
    else if (cssPath.endsWith('.vue'))
        jsPath = cssPath;
    else
        return Promise.reject('Wrong css Path: ' + cssPath);

    // vueExtendTree
    return vueExtendTree.findSuperByPath(jsPath).then((supr) => {
        if (supr.isVue)
            throw new Error('Unsupport auto extend for single vue files');

        const superCSSPath = path.join(supr.fullPath, '../module.css');
        if (fs.existsSync(superCSSPath))
            return superCSSPath;
        else
            return findSuperByCSSPath(superCSSPath, loader);
    });
}

module.exports = postcss.plugin('postcss-vusion-extend-mark', ({ resolve }) => (styles, result) => {
    let hasAutoExtend = false;

    styles.walkAtRules((rule) => {
        if (rule.name === 'extend') {
            addMark(styles, rule, EXTEND_START, EXTEND_END);
            rule.name = 'import';
            if (!rule.params)
                hasAutoExtend = true;
        } else if (rule.name === 'import') {
            addMark(styles, rule, IMPORT_START, IMPORT_END);
        } else if (rule.name === 'hook')
            rule.remove();
    });

    if (hasAutoExtend && vueCSSPathRE.test(result.opts.from)) {
        vueExtendTree.resolve = resolve;
        return findSuperByCSSPath(result.opts.from).then((superCSSPath) => {
            const relativePath = path.relative(path.join(result.opts.from, '../'), superCSSPath);
            styles.walkAtRules((rule) => {
                if (rule.name === 'import' && !rule.params)
                    rule.params = `'${relativePath}'`;
            });
        });
    }
});
