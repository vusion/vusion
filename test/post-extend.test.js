const path = require('path');
const { expect } = require('chai');
const rm = require('rimraf').sync;
const execa = require('execa');
const shell = require('shelljs');
const fs = require('fs');
const postcss = require('postcss');

describe('test css rule in build mode', () => {
    const buildCLI = path.join(__dirname, '../bin/vusion-build');
    const postMerge = path.resolve(__dirname, './features/postcss-extend');
    before(() => {
        shell.cd(postMerge);
    });

    after(() => {
        rm('public');
    });

    it('should build css with extend success', (done) => {
        let result;
        let files;
        execa(buildCLI, ['-e', './src/index.js']).then((res) => {
            result = res;
            files = fs.readdirSync('public');

            expect(result.code).to.equal(0);
            expect(files).to.eql([
                'bundle.css',
                'bundle.js',
            ]);
            done();
        }).catch(done);
    });

    it('extend css rule more than one', (done) => {
        let file;
        execa(buildCLI, ['-e', './src/index.js']).then((res) => {
            file = fs.readFileSync('public/bundle.css').toString();
            const anst = postcss.parse(file);
            const rule1 = anst.nodes[1];
            const rule2 = anst.nodes[2];
            const rule3 = anst.nodes[3];
            rule1.walkDecls('color', (decl) => {
                expect(decl.value).to.eql('red');
            });
            rule2.walkDecls('color', (decl) => {
                expect(decl.value).to.eql('purple');
            });
            rule3.walkDecls('color', (decl) => {
                expect(decl.value).to.eql('#ccc');
            });
            done();
        }).catch(done);
    });
});
