const semver = require('semver');
const chalk = require('chalk');
const pkg = require('../package.json');
const updateNotifier = require('update-notifier');

exports.checkNode = function () {
    // Ensure minimum supported node version is used
    const result = semver.satisfies(process.version, pkg.engines.node);

    !result && console.error(chalk.red(
        '  You must upgrade node to ' + pkg.engines.node + ' to use vusion'
    ));

    return result;
};

exports.checkVersion = function (version) {
    if (!version)
        return true;

    // Ensure minimum cli version for project is used
    const pkgVersion = pkg.version.split('-')[0];
    const result = semver.satisfies(pkgVersion, version);

    !result && console.error(chalk.red(
        '  You must upgrade vusion to ' + version + ' to develop current project'
    ));

    return result;
};

exports.checkUpgrade = function () {
    // Notify package upgrade. Check version once a week
    updateNotifier({
        pkg,
        updateCheckInterval: 1000 * 60 * 60 * 24 * 7,
    }).notify({
        isGlobal: true,
    });
};
