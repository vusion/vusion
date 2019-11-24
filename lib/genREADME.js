const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const logger = require('./logger');
const vusion = require('vusion-api');

function escape(name) {
    return name.replace(/\\?([[\]<>|])/g, '\\$1');
}

function formatValue(type, value) {
    if (value === null || value === undefined) {
        return '';
    } else if (Array.isArray(value))
        return `\`[${escape(value.join(', '))}]\``;
    else if (typeof value === 'string') {
        return `\`'${escape(value)}'\``;
    } else
        return `\`${value}\``;
}

function genOptions(options) {
    const outputs = [];

    outputs.push('### Options');
    outputs.push('');
    outputs.push('| Option | Type | Default | Description |');
    outputs.push('| ------ | ---- | ------- | ----------- |');

    options.forEach((option) => {
        outputs.push(`| ${option.name} | ${escape(option.type)} | ${formatValue(option.type, option.default)} | ${option.description} |`);
    });
    outputs.push('');

    return outputs.join('\n');
}

function genAttrs(attrs) {
    const outputs = [];

    outputs.push('### Props/Attrs');
    outputs.push('');
    outputs.push('| Prop/Attr | Type | Options | Default | Description |');
    outputs.push('| --------- | ---- | ------- | ------- | ----------- |');

    attrs.forEach((attr) => {
        outputs.push(`| ${attr.name} | ${escape(attr.type)} | ${attr.options ? attr.options.map((option) => formatValue(attr.type, option)).join(', ') : ''} | ${formatValue(attr.type, attr.default)} | ${attr.description} |`);
    });
    outputs.push('');

    return outputs.join('\n');
}

function genData(data) {
    const outputs = [];

    outputs.push('### Data');
    outputs.push('');
    outputs.push('| Data | Type | Default | Description |');
    outputs.push('| ---- | ---- | ------- | ----------- |');

    data.forEach((item) => {
        outputs.push(`| ${item.name} | ${escape(item.type)} | ${formatValue(item.type, item.default)} | ${item.description} |`);
    });
    outputs.push('');

    return outputs.join('\n');
}

function genComputed(computed) {
    const outputs = [];

    outputs.push('### Computed');
    outputs.push('');
    outputs.push('| Computed | Type | Default | Description |');
    outputs.push('| -------- | ---- | ------- | ----------- |');

    computed.forEach((item) => {
        outputs.push(`| ${item.name} | ${escape(item.type)} | ${formatValue(item.type, item.default)} | ${item.description} |`);
    });
    outputs.push('');

    return outputs.join('\n');
}

function genSlots(slots) {
    const outputs = [];

    outputs.push('### Slots');
    outputs.push('');

    slots.forEach((slot) => {
        outputs.push('#### ' + (slot.name === 'default' ? '(default)' : slot.name));
        outputs.push('');
        outputs.push(slot.description);
        outputs.push('');

        if (slot.props) {
            outputs.push('| Prop | Type | Description |');
            outputs.push('| ---- | ---- | ----------- |');

            slot.props.forEach((prop) => {
                outputs.push(`| ${prop.name} | ${escape(prop.type)} | ${prop.description} |`);
            });
            outputs.push('');
        }
    });

    return outputs.join('\n');
}

function genEvents(events) {
    const outputs = [];

    outputs.push('### Events');
    outputs.push('');

    events.forEach((event) => {
        outputs.push('#### @' + (event.name));
        outputs.push('');
        outputs.push(event.description);
        outputs.push('');

        if (event.params) {
            outputs.push('| Param | Type | Description |');
            outputs.push('| ----- | ---- | ----------- |');

            event.params.forEach((param) => {
                outputs.push(`| ${param.name} | ${escape(param.type)} | ${param.description} |`);
            });
            outputs.push('');
        }
    });

    return outputs.join('\n');
}

function genMethods(methods, type) {
    const outputs = [];

    outputs.push(`### ${type === 'global' ? 'Global ' : ''}Methods`);
    outputs.push('');

    methods.forEach((method) => {
        outputs.push('#### ' + (method.name));
        outputs.push('');
        outputs.push(method.description);
        outputs.push('');

        if (method.params) {
            outputs.push('| Param | Type | Default | Description |');
            outputs.push('| ----- | ---- | ------- | ----------- |');

            method.params.forEach((param) => {
                outputs.push(`| ${param.name} | ${escape(param.type)} | ${formatValue(param.type, param.default)} | ${param.description} |`);
            });
            outputs.push('');
        }
    });

    return outputs.join('\n');
}

function genARIA(aria) {
    const outputs = [];

    outputs.push('### ARIA and Keyboard');
    outputs.push('');
    outputs.push('| Key | Description |');
    outputs.push('| --- | ----------- |');

    aria.forEach((item) => {
        outputs.push(`| ${item.key} | ${item.description} |`);
    });
    outputs.push('');

    return outputs.join('\n');
}

module.exports = function genREADME(yamlPath) {
    const docsDir = path.join(yamlPath, '../docs');
    let docs = [];
    if (fs.existsSync(docsDir))
        docs = fs.readdirSync(docsDir);

    let api;
    try {
        api = YAML.parse(fs.readFileSync(yamlPath, 'utf8'));
    } catch (e) {
        logger.error(yamlPath);
        throw e;
    }

    const outputs = [];
    const mainComponent = api[0];

    // Title
    outputs.push(`<!-- 该 README.md 根据 api.yaml 和 docs/*.md 自动生成，为了方便在 GitHub 和 NPM 上查阅。如需修改，请查看源文件 -->`);
    outputs.push('');
    outputs.push(`# ${vusion.utils.kebab2Camel(mainComponent.name)}${mainComponent.title ? ' ' + mainComponent.title : ''}`);
    outputs.push('');

    if (mainComponent.labels) {
        outputs.push(mainComponent.labels.map((label) => `**${label}**`).join(', '));
        outputs.push('');
    }

    if (mainComponent.description) {
        outputs.push(mainComponent.description);
        outputs.push('');
    }

    if (docs.includes('index.md')) {
        outputs.push(fs.readFileSync(path.join(docsDir, 'index.md'), 'utf8'));
    }

    if (docs.includes('examples.md')) {
        outputs.push(!mainComponent.docs ? `## 示例` : `## 基础示例`);
        outputs.push(fs.readFileSync(path.join(docsDir, 'examples.md'), 'utf8'));
    }

    if (mainComponent.docs) {
        Object.keys(mainComponent.docs).forEach((name) => {
            if (docs.includes(name + '.md')) {
                outputs.push('## ' + mainComponent.docs[name]);
                outputs.push(fs.readFileSync(path.join(docsDir, name + '.md'), 'utf8'));
            }
        });
    }

    if (docs.includes('faq.md')) {
        outputs.push(`## 常见问题`);
        outputs.push(fs.readFileSync(path.join(docsDir, 'faq.md'), 'utf8'));
    }

    api.forEach(({ name, options, attrs, data, computed, slots, events, methods, aria }) => {
        outputs.push(api.length > 1 ? `## ${vusion.utils.kebab2Camel(name)} API` : '## API');
        if (!(options || attrs || data || computed || slots || events || methods || aria)) {
            outputs.push('');
            // outputs.push('无');
            // outputs.push('');
        } else {
            options && outputs.push(genOptions(options));
            attrs && outputs.push(genAttrs(attrs));
            data && outputs.push(genData(data));
            computed && outputs.push(genComputed(computed));
            slots && outputs.push(genSlots(slots));
            events && outputs.push(genEvents(events));
            methods && outputs.push(genMethods(methods));
            aria && outputs.push(genARIA(aria));
        }
    });

    return outputs.join('\n');
};

