'use strict';

const postcss = require('postcss');
const { EXTEND_START, EXTEND_END, IMPORT_START, IMPORT_END } = require('./DIVIDERS');

function isMarkComment(comment) {
    return [EXTEND_START, EXTEND_END, IMPORT_START, IMPORT_END].includes(comment.text);
}

function findLast(arr, condition, self) {
    for (let i = arr.length - 1; i >= 0; i--) {
        const item = arr[i];
        if (condition.call(self, item, i))
            return item;
    }
    return null;
}

function merge(extendedNodes, normalNodes) {
    const newNormalNodes = [];
    normalNodes.forEach((node) => {
        if (node.type !== 'rule')
            return newNormalNodes.push(node);

        // 合并相同 selector 的 rule
        const extendedNode = findLast(extendedNodes, (extendedNode) => extendedNode.selector === node.selector);
        if (extendedNode) {
            const newNormalDecls = [];
            node.nodes.forEach((decl) => {
                if (decl.type !== 'decl')
                    return newNormalDecls.push(decl);

                // 合并相同的 declarations
                const extendedDecl = findLast(extendedNode.nodes, (extendedDecl) => extendedDecl.prop === decl.prop);
                if (extendedDecl)
                    extendedDecl.value = decl.value;
                else
                    newNormalDecls.push(decl);
            });
            extendedNode.nodes.push(...newNormalDecls);
        } else
            newNormalNodes.push(node);
    });
    return extendedNodes.concat(newNormalNodes);
}

module.exports = postcss.plugin('postcss-vusion-extend-merge', () => (styles) => {
    const nodes = styles.nodes;
    let i = 0;

    function fetchNodes() {
        const currentNodes = [];
        while (i < nodes.length) {
            const node = nodes[i];
            if (isMarkComment(node))
                return currentNodes;
            else
                currentNodes.push(node);
            i++;
        }
        return currentNodes;
    }

    function reduceNodes() {
        let currentNodes = fetchNodes();
        while (i < nodes.length) {
            const node = nodes[i++];
            if (!node)
                break;

            if (node.text === EXTEND_START || node.text === IMPORT_START)
                currentNodes = currentNodes.concat(reduceNodes());
            if (node.text === EXTEND_END)
                currentNodes = merge(currentNodes, fetchNodes());
            else
                currentNodes = currentNodes.concat(fetchNodes());
        }
        return currentNodes;
    }

    const result = reduceNodes();
    styles.nodes = result;
});
