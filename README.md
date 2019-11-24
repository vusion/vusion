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
vusion init <dir> [templateName]
npm run dev
```

## Commands

- `vusion help`: Show help of all commands
- `vusion -V, --version`: Show the version of current CLI

- `init <type> <name> [dir]`: Initialize a material
- `add <type> [source] [target]`: Add a kind of material: block
- `remove <type> [source] [target]`: Remove a kind of material: block
- `publish <version>`: Publish a new version
- `screenshot`: Take a screenshot of a web page
- `ghpages`: Push a directory to gh-pages
- `readme`: Generate final readable README.md from api.yaml and docs
- `vetur`: Generate tags.json and attributes.json for Vetur
- `help [cmd]`: display help for `[cmd]`

Run `vusion <command> --help` for detailed usage of given command.
