const path = require('path');

const modules = require('app-module-path');
modules.addPath(path.resolve(__dirname, '../node_modules'));

const globalPath = path.resolve(__dirname, '../../');
if (globalPath.endsWith('node_modules'))
    modules.addPath(globalPath);
