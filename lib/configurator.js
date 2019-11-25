const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const YAML = require('yaml');

const rcPath = path.resolve(os.homedir(), '.vusionrc');

module.exports = {
    rcPath,
    load() {
        if (this.config)
            return this.config;

        if (!fs.existsSync(rcPath)) {
            fs.writeFileSync(rcPath, `registries:
  npm: https://registry.npmjs.org
download_registry: cnpm
publish_registry: npm
`);
        }

        this.yaml = fs.readFileSync(rcPath, 'utf8');

        this.config = YAML.parse(this.yaml);
        return this.config;
    },
    save() {
        fs.writeFileSync(rcPath, YAML.stringify(this.config), 'utf8');
    },
};
