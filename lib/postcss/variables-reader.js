module.exports = function (css, map, meta) {
    return `module.exports=${JSON.stringify(meta.ast.root.variables)}`;
};
