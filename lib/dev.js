const path = require('path');
const opn = require('opn');
const ora = require('ora');
const tcpPortUsed = require('tcp-port-used');
const merge = require('./merge');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const internalIp = require('internal-ip');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const notifier = require('node-notifier');

const createDomain = (options) => {
    const protocol = options.https ? 'https' : 'http';
    const port = options.port;
    const hostname = options.useLocalIp ? internalIp.v4() : options.host;

    // the formatted domain (url without path) of the webpack server
    return options.public ? `${protocol}://${options.public}` : `${protocol}://${hostname}:${port}`;
};

const config = global.vusionConfig;

const checkPort = (port, host) =>
    tcpPortUsed.check(port, host)
        .then((used) => (used) ? checkPort(port + 1, host) : port);

const addDevServerEntryPoints = (webpackConfig, devOptions, domain) => {
    const devClient = [require.resolve('webpack-hot-middleware/client') + '?reload=true'];

    if (domain) {
        devClient[0] = `${require.resolve('webpack-dev-server/client')}?${domain}`;
        if (devOptions.hotOnly)
            devClient.push('webpack/hot/only-dev-server');
        else if (devOptions.hot)
            devClient.push('webpack/hot/dev-server');
    }

    [].concat(webpackConfig).forEach((wpOpt) => {
        if (typeof wpOpt.entry === 'object' && !Array.isArray(wpOpt.entry)) {
            Object.keys(wpOpt.entry).forEach((key) => {
                wpOpt.entry[key] = devClient.concat(wpOpt.entry[key]);
            });
        } else if (typeof wpOpt.entry === 'function')
            wpOpt.entry = wpOpt.entry(devClient);
        else
            wpOpt.entry = devClient.concat(wpOpt.entry);
    });
};

const prepare = (webpackConfig, domain) => {
    const packagePath = path.resolve(process.cwd(), 'package.json');
    let title = 'Vusion project';
    try {
        title = require(packagePath).name;
    } catch (e) {}

    /**
     * Webpack config
     */
    const plugins = [
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development',
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(), // skip errors
    ];

    if (config.friendly) {
        plugins.push(new FriendlyErrorsWebpackPlugin({
            compilationSuccessInfo: {
                messages: [`Your application is running here: ${domain}`],
            },
            onErrors: (severity, errors) => {
                if (severity !== 'error')
                    return;

                const error = errors[0];
                const filename = error.file && error.file.split('!').pop();

                notifier.notify({
                    title,
                    message: severity + ': ' + error.name,
                    subtitle: filename || '',
                    icon: path.resolve(__dirname, '../assets/vusion.png'),
                });
            },
        }));
    }

    config.hot && plugins.push(new webpack.HotModuleReplacementPlugin());

    webpackConfig = merge(webpackConfig, {
        // eval-source-map is faster for development
        devtool: '#eval-source-map',
        plugins,
        performance: { hints: false },
    }, config.webpack);

    if (!webpackConfig.entry || Object.keys(webpackConfig.entry).length === 0) {
        // 如果没写的话，会默认指定一个
        webpackConfig.entry = {
            bundle: './index.js',
        };
    }

    const devOptions = Object.assign({
        contentBase: webpackConfig.output.path,
        publicPath: webpackConfig.output.publicPath || '',
        clientLogLevel: config.verbose ? 'info' : 'warning',
        overlay: true,
        quiet: !config.verbose,
        // noInfo: true,
        // inline: true,
        hot: config.hot,
        stats: config.verbose ? { all: true, colors: true } : webpackConfig.stats,
        historyApiFallback: true,
    }, config.webpackDevServer);

    if (config.staticPath) {
        const staticPaths = Array.isArray(config.staticPath) ? config.staticPath : [config.staticPath];
        webpackConfig.plugins.push(
            new CopyWebpackPlugin(staticPaths.map((spath) => Object.assign({
                from: path.resolve(process.cwd(), spath),
                to: webpackConfig.output.path,
                ignore: ['.*'],
            }, config.options.CopyWebpackPlugin)))
        );
    }

    /**
     * WebpackDevServer Config
     */
    // add hot-reload related code to entry chunks
    config.hot && addDevServerEntryPoints(webpackConfig, devOptions, domain);
    const compiler = webpack(webpackConfig);

    return { compiler, devOptions };
};

module.exports = (webpackConfig) => ({
    start() {
        let options = config.webpackDevServer || {};
        options = {
            host: options.host || 'localhost',
            port: options.port || 9000,
            useLocalIp: options.useLocalIp,
        };

        checkPort(options.port, options.host)
            .then((port) => {
                options.port = port;
                const url = createDomain(options);
                const { compiler, devOptions } = prepare(webpackConfig, url);
                const server = new WebpackDevServer(compiler, devOptions);

                /**
                 * Start Server
                 */
                return new Promise((resolve, reject) => {
                    const spinner = ora('First compiling for developing...');
                    spinner.start();
                    server.listen(options.port, options.host, (err) => {
                        if (err) {
                            console.error(err);
                            return reject(err);
                        }

                        compiler.plugin('done', () => spinner.stop());
                        // console.info('> Listening at ' + url + '\n');
                        if (config.open && !process.env.TEST)
                            opn(url);
                        process.send && process.send(config);
                        resolve();
                    });
                });
            }).catch((err) => {
                console.error(err);
            });
    },
});
module.exports.prepare = prepare;
