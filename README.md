# Vusion

CLI for developing Vusion Projects.

[![CircleCI][circleci-img]][circleci-url]
[![NPM Version][npm-img]][npm-url]
[![Dependencies][david-img]][david-url]
[![NPM Download][download-img]][download-url]

[circleci-img]: https://img.shields.io/circleci/project/github/vusion/vusion.svg?style=flat-square
[circleci-url]: https://circleci.com/gh/vusion/vusion
[npm-img]: http://img.shields.io/npm/v/vusion.svg?style=flat-square
[npm-url]: http://npmjs.org/package/vusion
[david-img]: http://img.shields.io/david/vusion/vusion.svg?style=flat-square
[david-url]: https://david-dm.org/vusion/vusion
[download-img]: https://img.shields.io/npm/dm/vusion.svg?style=flat-square
[download-url]: https://npmjs.org/package/vusion

## Project Types

- `library`
- `app`

## Install

``` shell
npm install -g vusion
```

## Quick Start

``` shell
vusion init app my-app
npm install
vusion dev
```

## Commands

- `vusion help`: Show help of all commands
- `vusion -V, --version`: Show the version of current CLI

- `vusion init <project-type> <project-name>`: Initalize a vusion project
- `vusion publish <version>`: Publish a new version
- `vusion ghpages [directory]`: Push output directory to gh-pages. If the directory is not specfied, it will be webpack output path
    - `-c, --config-path <path>`: Vusion config path
- `vusion list [directory]`: List all components in a directory. If the directory is not specfied, it will be process.cwd()
- `vusion transform <vue-path>`: Transform Vue component between singlefile and multifile pattern
