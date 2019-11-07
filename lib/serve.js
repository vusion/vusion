const Koa = require('koa');
const opn = require('opn');
const internalIp = require('internal-ip');
const tcpPortUsed = require('tcp-port-used');
const historyFallback = require('koa2-history-api-fallback');

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

const prepare = (webpackConfig, domain) => {
    const devOptions = Object.assign({
        contentBase: webpackConfig.output.path,
        publicPath: webpackConfig.output.publicPath || '',
        // noInfo: true,
        // inline: true,
        hot: config.hot,
        historyApiFallback: true,
        stats: webpackConfig.stats,
    }, config.webpackDevServer);

    return { devOptions };
};

module.exports = (webpackConfig) => ({
    start() {
        let options = config.webpackDevServer || {};
        options = {
            host: options.host || '0.0.0.0',
            port: options.port || 80,
            useLocalIp: options.useLocalIp,
        };

        checkPort(options.port, options.host)
            .then((port) => {
                options.port = port;
                const url = createDomain(options);
                const { devOptions } = prepare(webpackConfig, url);
                const app = new Koa();
                app.use(require('koa-static')(devOptions.contentBase));
                app.use(historyFallback());

                /**
                 * Start Server
                 */
                return new Promise((resolve, reject) => {
                    app.listen(options.port, options.host, (err) => {
                        if (err) {
                            console.error(err);
                            return reject(err);
                        }

                        console.info('> Listening at ' + url + '\n');
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
