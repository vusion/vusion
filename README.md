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

## Install

``` shell
npm install -g vusion
```

## Quick Start

``` shell
vusion init
```

## Commands

- `vusion help`: Show help of all commands
- `vusion -V, --version`: Show the version of current CLI

- `init <type> <name>`: Initialize a material
- `config <action> <key> [value]`: Configure CLI options
- `publish <version>`: Publish a new version
- `screenshot <url|local-file>`: Take a screenshot of a web page
- `deploy`: Push files to NOS static bucket
- `ghpages`: Push a directory to gh-pages
- `readme`: Generate final readable README.md from api.yaml and docs
- `vetur`: Generate tags.json and attributes.json for Vetur
- `diff <source> <target>`: Check differences between two path files
- `sync <source> <target>`: Sync files from one path to another. Support watch mode
- `help [cmd]`: display help for `[cmd]`

Run `vusion <command> --help` for detailed usage of given command.
