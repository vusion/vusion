module.exports = {
    type: 'app',
    uglifyJS: false,
    extractCSS: true,
    webpack: {
        entry: {
            bundle: './src/index.js',
        },
    },
};
