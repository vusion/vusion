const path = require('path');
const { expect } = require('chai');
const rm = require('rimraf').sync;
const execa = require('execa');
const shell = require('shelljs');
const fs = require('fs');
const postcss = require('postcss');

describe('test svg sprite in build mode', () => {
    const buildCLI = path.join(__dirname, '../bin/vusion-build');
    const postMerge = path.resolve(__dirname, './fixtures/postcss-merge');
    before(() => {
        shell.cd(postMerge);
    });

    after(() => {
        rm('public');
    });

    it('should build css with merge success', (done) => {
        let result;
        let files;
        execa(buildCLI, ['-e', './index.js']).then((res) => {
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

    it('merge css rule more than one', (done) => {
        let result;
        let file;
        execa(buildCLI, ['-e', './index1.js']).then((res) => {
            result = res;
            file = fs.readFileSync('public/bundle.css').toString();
            const anst = postcss.parse(file);
            const root = anst.nodes[0];
            const child2 = anst.nodes[2];
            root.walkDecls('height', (decl) => {
                expect(decl.value).to.eql('150px');
            });
            root.walkDecls('background', (decl) => {
                expect(decl.value).to.eql('blue');
            });
            child2.walkDecls('float', (decl) => {
                expect(decl.value).to.eql('right');
            });
            child2.walkDecls('background', (decl) => {
                expect(decl.value).to.eql('azure');
            });
            done();
        }).catch(done);
    });
    it('merge css rule have , partition off', (done) => {
        let result;
        let file;
        execa(buildCLI, ['-e', './index2.js']).then((res) => {
            result = res;
            file = fs.readFileSync('public/bundle.css').toString();
            const anst = postcss.parse(file);
            const root = anst.nodes[0];
            const child1AndChild2 = anst.nodes[1];
            const child1 = anst.nodes[2];

            root.walkDecls('height', (decl) => {
                expect(decl.value).to.eql('150px');
            });
            root.walkDecls('background', (decl) => {
                expect(decl.value).to.eql('blue');
            });
            child1AndChild2.walkDecls('width', (decl) => {
                expect(decl.value).to.eql('10px');
            });
            child1AndChild2.walkDecls('height', (decl) => {
                expect(decl.value).to.eql('10px');
            });
            child1AndChild2.walkDecls('background', (decl) => {
                expect(decl.value).to.eql('orange');
            });
            child1.walkDecls('float', (decl) => {
                expect(decl.value).to.eql('left');
            });
            child1.walkDecls('background', (decl) => {
                expect(decl.value).to.eql('azure');
            });
            done();
        }).catch(done);
    });
});
