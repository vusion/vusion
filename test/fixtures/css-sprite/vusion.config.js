module.exports = {
    type: 'app',
    webpack: {
        entry: {
            index: './index.js',
        },
        output: {
            publicPath: `/public/`,
        },
    },
};
