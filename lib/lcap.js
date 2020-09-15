const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs-extra');
const MarkdownIt = require('markdown-it');

const md = new MarkdownIt();

const removeDeprecated = function (component) {
    if (component.events) {
        component.events = component.events.map((item) => {
            if (item.description === '@deprecated') {
                return null;
            }
            if (item.deprecated === true) {
                return null;
            }
            return item;
        }).filter((i) => i);
    }
    if (component.attrs) {
        component.attrs = component.attrs.map((item) => {
            if (item.description === '@deprecated') {
                return null;
            }
            if (item.deprecated === true) {
                return null;
            }
            return item;
        }).filter((i) => i);
    }
};

module.exports = function (dir) {
    let desc = null;
    if (fs.existsSync(dir)) {
        desc = yaml.load(fs.readFileSync(path.join(dir, 'api.yaml')).toString());
    } else {
        throw new Error(`${dir} api.yaml not exist`);
    }
    if (Array.isArray(desc)) {
        desc.forEach((item) => {
            removeDeprecated(item);
        });
        if (desc.length > 1) {
            const tmp = desc;
            desc = tmp.shift();
            desc.children = tmp;
        } else {
            desc = desc[0];
        }
    }
    const labels = desc.labels;
    if (!labels) {
        throw new Error(`${desc.name} labels not exist`);
    }
    const blocks = [];

    const blockPath = path.join(dir, 'docs/blocks.md');
    if (fs.existsSync(blockPath)) {
        const blockList = md.parse(fs.readFileSync(blockPath).toString());
        blockList.forEach((block) => {
            if (block.tag === 'code') {
                blocks.push(block.content);
            }
        });
    }
    let screenShot = [];

    const screenShotPath = path.join(dir, 'screenshots');
    if (fs.existsSync(path.join(screenShotPath, '0.png'))) {
        screenShot = fs.readdirSync(screenShotPath);
    }
    return {
        symbol: desc.name,
        name: desc.title,
        jsonSchema: desc,
        description: desc.description,
        labels,
        screenShot: JSON.stringify(screenShot),
        blocks: JSON.stringify(blocks),
    };
};
