const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
const glob = require('glob');
const tcpPortUsed = require('tcp-port-used');
const merge = require('./merge');
const { Server } = require('karma');
const selectorPath = require.resolve('@vusion/vue-loader/lib/selector');

const config = global.vusionConfig;

const checkPort = (port, host) =>
    tcpPortUsed.check(port, host)
        .then((used) => (used) ? checkPort(port + 1, host) : port);

const filterVueTest = (srcPath) => {
    const vueFilesWithTest = glob.sync(srcPath + '/**/*.vue').filter((file) => !file.includes('node_modules')
        && fs.lstatSync(file).isFile()
        && fs.readFileSync(file, 'utf8').match(/<test>[\s\S]*<\/test>/));
    return vueFilesWithTest;
};

/**
 * vusion test 会默认跑 src 或 test 目录下以 .spec.js 结尾的文件
 * 或者 *.vue 中包含 test 标签下的测试代码
 * 只对包含有 test 标签的 vue 文件做处理（否则 webpack 会报一大堆 warning）
 */
const getRequireTestString = (type, path, reg) => `const ${type}Context = require.context('${path}', true, /${reg || '\\.spec$'}/);
${type}Context.keys().forEach(${type}Context);\n`;

const prepareRequireTest = () => {
    shell.rm('-f', path.resolve(__dirname, '__requireTest_*'));

    const content = [];

    if (global.extraArgs.length) {
        global.extraArgs.forEach((arg) => {
            content.push(`require('${path.resolve(process.cwd(), arg)}');\n`);
        });
    } else {
        // srcContext
        let srcPath = path.resolve(process.cwd(), config.testPaths.src);
        srcPath = path.sep === '\\' ? srcPath.replace(/\\/g, '/') : srcPath;
        if (fs.existsSync(srcPath)) {
            content.push(getRequireTestString('src', srcPath));

            // vueContext
            const vueFilesWithTest = filterVueTest(srcPath);
            if (vueFilesWithTest.length) {
                const regPaths = vueFilesWithTest.map((filePath) => path.relative(srcPath, filePath).replace(/([\\/.])/g, '\\$1')).join('|');
                content.push(getRequireTestString('vue', `!!${selectorPath}?type=customBlocks&index=0!${srcPath}`, regPaths));
            }
        }

        // testContext
        let testPath = path.resolve(process.cwd(), config.testPaths.unit);
        testPath = path.sep === '\\' ? testPath.replace(/\\/g, '/') : testPath;
        if (fs.existsSync(testPath))
            content.push(getRequireTestString('test', testPath));
    }

    // WriteFile
    const requireTestPath = path.resolve(__dirname, `__requireTest_${Date.now()}.js`);
    fs.writeFileSync(requireTestPath, content.join('\n'));

    return { requireTestPath };
};

const prepare = (webpackConfig, port) => {
    /**
     * Webpack config
     */
    webpackConfig = merge(webpackConfig, {
        devtool: '#inline-source-map',
    }, config.webpack);

    // Don't need to specify the entry option for karma
    delete webpackConfig.entry;

    const { requireTestPath } = prepareRequireTest();

    /**
     * Karma config
     */
    const karmaConfig = merge({
        files: [requireTestPath],
        preprocessors: {
            [requireTestPath]: ['webpack', 'sourcemap'],
        },
        webpack: webpackConfig,
        webpackMiddleware: { noInfo: true },
        frameworks: ['mocha', 'chai'],
        browsers: ['Chrome'],
        reporters: ['spec', 'coverage'],
        singleRun: true,
        plugins: [
            'karma-chrome-launcher',
            'karma-mocha',
            'karma-spec-reporter',
            'karma-coverage',
            'karma-coveralls',
            'karma-webpack',
            'karma-sourcemap-loader',
            'karma-chai',
        ],
        coverageReporter: {
            dir: `test-reports/`,
            reporters: [
                { type: 'lcov', subdir: '.' },
                { type: 'text' },
            ],
        },
    }, config.karma, {
        port,
    });

    return karmaConfig;
};

module.exports = (webpackConfig) => ({
    start() {
        checkPort(config.karma.port || 9876, 'localhost')
            .then((port) => {
                const karmaConfig = prepare(webpackConfig, port);

                /**
                 * Start Karma
                 */
                const server = new Server(karmaConfig, (exitCode) => {
                    console.info(`Karma has exited with ${exitCode}`);
                    process.exit(exitCode);
                });
                server.start();
                return Promise.resolve();
            });
    },
});
module.exports.prepare = prepare;
