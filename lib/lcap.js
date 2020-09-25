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
        const tokens = md.parse(fs.readFileSync(blockPath).toString());
        let title = '';
        let description = '';
        tokens.forEach((token, index) => {
            if (token.type === 'heading_close' && token.tag === 'h3') {
                const inline = tokens[index - 1];
                if (inline && inline.type === 'inline')
                    title = inline.content;
            } else if (token.type === 'paragraph_close') {
                const inline = tokens[index - 1];
                if (inline && inline.type === 'inline')
                    description += inline.content + '\n';
            } else if (token.type === 'fence') {
                const lang = token.info.trim().split(' ')[0];

                if (lang === 'html') {
                    blocks.push({
                        title,
                        description,
                        code: `<template>\n${token.content}</template>\n`,
                    });
                } else if (lang === 'vue') {
                    blocks.push({
                        title,
                        description,
                        code: token.content,
                    });
                }
                description = '';
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
        icon: desc.icon,
        jsonSchema: {
            name: desc.name,
            title: desc.title,
            description: desc.description,
            category: desc.labels[0],
            screenShot: JSON.stringify(screenShot),
            blocks: JSON.stringify(blocks),
            attrs: desc.attrs,
            slots: desc.slots,
            methods: desc.methods,
            events: desc.events,
            children: (desc.children || []).map((child) => ({
                attrs: child.attrs,
                slots: child.slots,
                events: child.events,
                name: child.name,
                title: child.title,
                description: child.description,
            })),
        },
        description: desc.description,
        labels,
        screenShot: JSON.stringify(screenShot),
        blocks: JSON.stringify(blocks),
    };
};
