const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    type: 'app',
    webpack: {
        entry: {
            bundle: './src/views/index.js',
        },
        resolve: {
            alias: {
                app: __dirname,
                '@': path.resolve(__dirname, 'src/views/'),
                basecss: path.resolve(__dirname, 'src/views/base.css'),
            },
        },
        plugins: [
            new HtmlWebpackPlugin({ filename: 'index.html', hash: true, template: './src/views/index.html', chunks: ['bundle'] }),
        ],
    },
};
