/* eslint-disable no-multi-spaces */
module.exports = {
    type: '',                              // [Required] Vusion project type. 'library', 'app'
    staticPath: '',                        // Path of static files, which will be copied into destination directory. It accepts a String or Array.
    srcPath: './src',                      // To be `./src` by default
    libraryPath: '',                       // [Required] Library directory path. To be srcPath by default
    baseCSSPath: '',                       // Path of base CSS. If not set, it will be `library/base/base.css`
    globalCSSPath: '',                     // Path of global CSS. If not set, it will be `library/base/global.css`
    theme: undefined,                      // Project theme
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
    resolvePriority: 'current',            // Priority to resolve modules or loaders, "current"(default), "cwd" or "cli"
    browsers: ['> 1%', 'last 2 versions', 'ie >= 9'],    // Browers Compatibility referred in autoprefixer. See browserslist for more details
    babel: false,                          // Use babel in `dev` mode. Always be true in `build` mode
    babelIncludes: [],                     // Reinclude some files excluded in node_modules
    webpack: {},                           // Extend webpack configuration
    webpackDevServer: {},                  // Extend webpackDevServer configuration
    postcss: [],                           // Extend postcss plugins
    vue: {},                               // Extend vue-loader options
    karma: {},                             // Extend karma configuration
    options: {},                           // Extra options for loaders or plugins,
    // such as IconFontPlugin, CSSSpritePlugin, ExtractTextWebpackPlugin, UglifyjsWebpackPlugin, EnvironmentPlugin, BabelMinifyWebpackPlugin, CopyWebpackPlugin, ForceShakingPlugin
};
