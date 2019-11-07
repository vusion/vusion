# Vusion CLI

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
- `vusion dev`: Run webpack develop server
    - `-c, --config-path <path>`: Vusion config path
    - `-e, --entry-path <path>`: Change default entry path
    - `-l, --library-path <path>`: Library entry path. To be `./index.js` by default if project type is `library`
    - `-d, --docs`: Generate docs of common components in library. Always be true if project type is `library`
    - `-p, --port <port>`: Web Server Port
    - `-O, --no-open`: Disable to open browser at the beginning
    - `-H, --no-hot`: Disable to hot reload
    - `-v, --verbose`: Show more information
    - `--resolve-priority`: Priority to resolve modules or loaders, "cwd"(default) or "cli"
- `vusion build`: Build a distribution
    - `-c, --config-path <path>`: Vusion config path
    - `-e, --entry-path <path>`: Change default entry path
    - `-C, --no-clean`: Not clean the output directory at start
    - `-l, --library-path <path>`: Library entry path. To be `./index.js` by default if project type is `library`
    - `-d, --docs`: Generate docs of common components in library. Always be true if project type is `library`
    - `-s, --source-map`: Generate source map in build mode
    - `-v, --verbose`: Show more information
    - `--extract-css`: Extract CSS by ExtractTextWebpackPlugin in build mode
    - `--uglify-js`: Compress and mangle JS by UglifyjsWebpackPlugin in build mode
    - `--minify-js`: Minify JS only in `build` mode. Set `true` or `'babel-minify'` to use BabelBabelMinifyWebpackPlugin, set `'uglify-js'` to use UglifyjsWebpackPlugin as same as `--uglify`
    - `--force-shaking`: Force to enable tree shaking under this path without care of side effects. It\'s different from default tree shaking of webpack
    - `--experimental`: Enable some experimental loaders or plugins
    - `--resolve-priority`: Priority to resolve modules or loaders, "cwd"(default) or "cli"
- `vusion serve`: Run a static server
    - `-c, --config-path <path>`: Vusion config path
    - `-p, --port <port>`: Web Server Port
    - `-O, --no-open`: Disable to open browser at the beginning
- `vusion test`: Run karma test
    - `-c, --config-path <path>`: Vusion config path
    - `-p, --port <port>`: Web Server Port
    - `-w, --watch`: Karma watch
    - `--resolve-priority`: Priority to resolve modules or loaders, "cwd"(default) or "cli"
- `vusion publish <version>`: Publish a new version
- `vusion ghpages [directory]`: Push output directory to gh-pages. If the directory is not specfied, it will be webpack output path
    - `-c, --config-path <path>`: Vusion config path
- `vusion dep`: List dependencies of vusion
- `vusion list [directory]`: List all components in a directory. If the directory is not specfied, it will be process.cwd()
- `vusion transform <vue-path>`: Transform Vue component between singlefile and multifile pattern

## Configuration

Default `vusion.config.js` file:

``` js
{
    type: '',                              // [Required] Vusion project type. 'library', 'app'
    staticPath: '',                        // Path of static files, which will be copied into destination directory. It accepts a String or Array.
    libraryPath: '',                       // [Required] Library directory path. To be srcPath by default
    baseCSSPath: '',                       // Path of base CSS. If not set, it will be `library/base/base.css`
    globalCSSPath: '',                     // Path of global CSS. If not set, it will be `library/base/global.css`
    testPaths: {                           // Paths for karma test
        src: './src',
        unit: './test/unit',
    },
    entry: {                               // Generate entry and HTMLWebpackPlugin automatically
        pages: undefined,
        prepend: [],
        append: [],
        commons: false,
        template: undefined,
    },
    clean: true,                           // Clean the output directory in `build` mode
    docs: false,                           // Generate docs of common components in library. Always be true if project type is `library`
    open: true,                            // Enable/Disable to open browser at the beginning in `dev` mode
    hot: true,                             // Enable/Disable to hot reload in `dev` mode
    sourceMap: false,                      // Generate sourceMap in `build` mode
    verbose: false,                        // Show more information
    friendly: true,                        // Show errors friendly via FriendlyErrorsPlugin in `dev` mode
    lint: false,                           // Lint codes when compiling via eslint-loader
    extractCSS: false,                     // Extract CSS via ExtractTextWebpackPlugin only in `build` mode
    uglifyJS: true,                        // Compress JS via UglifyjsWebpackPlugin only in `build` mode
    minifyJS: false,                       // Minify JS only in `build` mode. Set `true` or 'babel-minify' to use BabelBabelMinifyWebpackPlugin, set 'uglify-js' to use UglifyjsWebpackPlugin as same as `uglifyJS: true`
    forceShaking: false,                   // Force to enable tree shaking under this path without care of side effects. It's different from default tree shaking of webpack.
    concatenation: true,
    experimental: false,                   // Enable some experimental loaders or plugins, like ModuleConcatenationPlugin
    resolvePriority: 'cwd',                // Priority to resolve modules or loaders, "current"(default), "cwd" or "cli"
    browsers: ['> 1%', 'last 2 versions', 'ie >= 9'],    // Browers Compatibility referred in autoprefixer. See browserslist for more details
    babelIncludes: [],                     // Reinclude some files excluded in node_modules
    webpack: {},                           // Extend webpack configuration
    webpackDevServer: {},                  // Extend webpackDevServer configuration
    postcss: [],                           // Extend postcss plugins
    vue: {},                               // Extend vue-loader options
    karma: {},                             // Extend karma configuration
    options: {},                           // Extra options for loaders or plugins,
    // such as IconFontPlugin, CSSSpritePlugin, ExtractTextWebpackPlugin, UglifyjsWebpackPlugin, EnvironmentPlugin, BabelMinifyWebpackPlugin, CopyWebpackPlugin, ForceShakingPlugin
};

```

## Development

### Related Dependencies

- [vue-multifile-loader][vue-multifile-loader-url] ![vue-multifile-loader][vue-multifile-loader-img]
- [@vusion/vue-loader][vusion-vue-loader-url] ![@vusion/vue-loader][vusion-vue-loader-img]
- [@vusion/css-loader][vusion-css-loader-url] ![@vusion/css-loader][vusion-css-loader-img]
- [@vusion/doc-loader][vusion-doc-loader-url] ![@vusion/doc-loader][vusion-doc-loader-img]
- [icon-font-loader][icon-font-loader-url] ![icon-font-loader][icon-font-loader-img]
- [css-sprite-loader][css-sprite-loader-url] ![css-sprite-loader][css-sprite-loader-img]
- [svg-classic-sprite-loader][svg-classic-sprite-loader-url] ![svg-classic-sprite-loader][svg-classic-sprite-loader-img]

[vue-multifile-loader-img]: http://img.shields.io/npm/v/vue-multifile-loader.svg?style=flat-square
[vue-multifile-loader-url]: http://npmjs.org/package/vue-multifile-loader
[vusion-vue-loader-img]: http://img.shields.io/npm/v/@vusion/vue-loader.svg?style=flat-square
[vusion-vue-loader-url]: http://npmjs.org/package/@vusion/vue-loader
[vusion-css-loader-img]: http://img.shields.io/npm/v/@vusion/css-loader.svg?style=flat-square
[vusion-css-loader-url]: http://npmjs.org/package/@vusion/css-loader
[vusion-doc-loader-img]: http://img.shields.io/npm/v/@vusion/doc-loader.svg?style=flat-square
[vusion-doc-loader-url]: http://npmjs.org/package/@vusion/doc-loader
[icon-font-loader-img]: http://img.shields.io/npm/v/icon-font-loader.svg?style=flat-square
[icon-font-loader-url]: http://npmjs.org/package/icon-font-loader
[css-sprite-loader-img]: http://img.shields.io/npm/v/css-sprite-loader.svg?style=flat-square
[css-sprite-loader-url]: http://npmjs.org/package/css-sprite-loader
[svg-classic-sprite-loader-img]: http://img.shields.io/npm/v/svg-classic-sprite-loader.svg?style=flat-square
[svg-classic-sprite-loader-url]: http://npmjs.org/package/svg-classic-sprite-loader
