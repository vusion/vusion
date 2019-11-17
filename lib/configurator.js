const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const YAML = require('yaml');

const rcPath = path.resolve(os.homedir(), '.vusionrc');

module.exports = {
    load() {
        if (this.config)
            return this.config;
        fs.ensureFileSync(rcPath);
        this.config = YAML.parse(fs.readFileSync(rcPath, 'utf8'));
        if (!this.config.registries) {
            this.config.registries = {
                npm: 'https://registry.npmjs.org',
                cnpm: 'https://registry.npm.taobao.org',
            };
        }
        if (!this.config.default_registry)
            this.config.default_registry = 'npm';
        return this.config;
    },
    save() {
        fs.writeFileSync(rcPath, YAML.stringify(this.config), 'utf8');
    },
};

