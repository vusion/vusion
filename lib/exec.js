const spawn = require('child_process').spawn;

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
