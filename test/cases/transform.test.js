const { expect } = require('chai');
const shell = require('shelljs');
const fs = require('fs-extra');
const execa = require('execa');

describe('vusion transform', () => {
    it('vusion transform', () => {
        fs.ensureDirSync('./tmp');
        shell.rm('-rf', './tmp/u-single.vue');
        shell.cp('./test/fixtures/u-single.vue', './tmp');
        execa.sync('./bin/vusion-transform', ['./tmp/u-single.vue']);
        expect(fs.readdirSync('./tmp/u-single.vue').includes('index.html')).to.be.true;
        expect(fs.readdirSync('./tmp/u-single.vue').includes('index.js')).to.be.true;
    });
});
