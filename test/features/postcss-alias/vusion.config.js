const path = require('path');

module.exports = {
    type: 'app',
    webpack: {
        entry: {
            bundle: './src/index.js',
        },
        resolve: {
            alias: {
                app: __dirname,
                '@': path.resolve(__dirname, 'src'),
                basecss: path.resolve(__dirname, 'src/base.css'),
            },
        },
    },
};
