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
        return this.config;
    },
    save() {
        fs.writeFileSync(rcPath, YAML.stringify(this.config), 'utf8');
    },
};

