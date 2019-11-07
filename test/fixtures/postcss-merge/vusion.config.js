module.exports = {
    type: 'app',
    extractCSS: true,
    webpack: {
        entry: {
            index: './index.js',
            index1: './index1.js',
            index2: './index2.js',
        },
        output: {
            publicPath: `/public/`,
        },
    },
    webpackDevServer: {
        contentBase: __dirname,
    },
};
