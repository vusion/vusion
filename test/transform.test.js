const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const shell = require('shelljs');
const execa = require('execa');

describe('command: transform', () => {
    const command = path.resolve(__dirname, '../bin/vusion-transform');

    const fixturesPath = path.resolve(__dirname, 'fixtures/transform');
    shell.cd(fixturesPath);
    it('should transform correctly', () => {
        const fixtures = shell.ls();

        const promises = fixtures.map((fixture) => {
            const multiPath = path.resolve(fixturesPath, fixture + '/multi.vue');
            const singlePath = path.resolve(fixturesPath, fixture + '/single.vue');
            const testPath = path.resolve(fixturesPath, fixture + '/test.vue');

            shell.rm('-f', testPath);
            shell.cp(singlePath, testPath);

            return execa(command, [testPath]).then(() => {
                const files = fs.readdirSync(testPath);
                expect(files.join(',')).to
                    .equal(fs.readdirSync(multiPath).join(','));

                files.forEach((file) => {
                    expect(fs.readFileSync(path.resolve(testPath, file), 'utf8')).to
                        .equal(fs.readFileSync(path.resolve(multiPath, file), 'utf8'));
                });

                return execa(command, [testPath]);
            }).then(() => {
                expect(fs.readFileSync(testPath, 'utf8')).to
                    .equal(fs.readFileSync(singlePath, 'utf8'));

                shell.rm('-f', testPath);
            }).catch((e) => {
                shell.rm('-f', testPath);
                throw e;
            });
        });

        return Promise.all(promises);
    });
});
