const spawn = require('child_process').spawn;

/**
 * 有时需要完全透传一个命令的所有信息
 * shell.exec 和 execa 都不好用
 * 直接用 spawn 的 inherit 模式即可
 *
 * 两种方式，第二种是为了避免空格的情况
 * exec('git clone xxx')
 * exec('git', ['clone' 'xxx'])
 */
module.exports = function exec(cmd, args) {
    if (!args) {
        const arr = cmd.split(' ');
        cmd = arr[0];
        args = arr.slice(1);
    }

    return new Promise(((resolve, reject) => {
        const result = spawn(cmd, args, {
            stdio: 'inherit',
        });
        result.on('error', reject);
        result.on('close', (code) => code === 0 ? resolve() : reject());
    }));
};
