const path = require('path');
const { expect } = require('chai');
const execa = require('execa');
const fs = require('fs');
const rm = require('rimraf').sync;
const shell = require('shelljs');

describe('command: init', () => {
    const cli = path.join(__dirname, '../bin/vusion-init');
    const originalCwd = process.cwd();
    const mockPath = path.join(__dirname, './mock-vusion-project');

    const setup = () => {
        shell.cd(mockPath);
    };

    const teardown = (done) => {
        setup();
        rm('*');
        done();
    };

    describe('init an app type project', () => {
        let result;
        let files;
        const type = 'app';
        const projectName = 'vusion-app-project';
        const projectPath = path.join(__dirname, './mock-vusion-project/', projectName);

        before((done) => {
            setup();
            execa(cli, [type, projectName])
                .then((res) => {
                    result = res;
                    files = fs.readdirSync(projectName);
                    shell.cd(projectPath);
                    return execa('npm', ['i']);
                })
                .then((res) => {
                    done();
                })
                .catch(done);
        });

        after(teardown);

        it('should init with expected files', (done) => {
            const config = require(path.resolve(projectPath, files.find((file) => file.endsWith('config.js'))));
            expect(config.type).to.equal(type);
            expect(result.code).to.equal(0);
            done();
        });
    });

    describe('init a library type project', () => {
        let result;
        let files;
        const type = 'library';
        const projectName = 'vusion-library-project';

        before((done) => {
            setup();
            execa(cli, [type, projectName])
                .then((res) => {
                    result = res;
                    files = fs.readdirSync(projectName);
                    done();
                })
                .catch(done);
        });

        after(teardown);

        it('should init with expected files', (done) => {
            const config = require(path.join(process.cwd(), projectName, files.find((file) => file.endsWith('.json'))));
            expect(config.vusion.type).to.equal(type);
            expect(result.code).to.equal(0);
            done();
        });
    });
});
