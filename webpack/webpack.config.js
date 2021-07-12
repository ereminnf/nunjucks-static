const webpack = require('webpack');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const utils = require('./index').utils;
const htmlPlugin = require('../src/htmlPlugin');

module.exports = (env, argv) => {
    const prod = argv.mode === 'production';
    const dev = argv.mode === 'development';

    const config = {
        entry: {
            app: [
                `${utils.paths.client}/styles/index.scss`,
                `${utils.paths.client}/app.js`
            ],
        },
        resolve: {
            extensions: utils.extensions(),
            alias: utils.alias(),
        },
        performance: {
            hints: false,
        },
        watchOptions: {
            ignored: /node_modules/
        },
        module: {
            rules: [
                utils.rules.scssModule(),
                utils.rules.scss(),
                utils.rules.js(),
                utils.rules.ts(),
                utils.rules.fileFonts(),
                utils.rules.fileImg(),
                utils.rules.nunjucks()
            ]
        },
        plugins: [
            new FixStyleOnlyEntriesPlugin(),
            new CleanWebpackPlugin(
                {
                cleanStaleWebpackAssets: false,
                cleanAfterEveryBuildPatterns: ["!html", "!html/**/*", "*.json", "*.hot-update.json", "*.hot-update.js"]
            }
            ),
            new CopyWebpackPlugin({
                patterns: [
                    { from: `${utils.paths.client}/${utils.paths.assets}/`, to: `${utils.paths.assets}/` }
                ]
            }),
            new MiniCssExtractPlugin({
                filename: `${utils.paths.bundles}/css/[name].${prod ? '[contenthash:5].' : ''}css`,
                chunkFilename: `${utils.paths.bundles}/css/[id].${prod ? '[contenthash:5].' : ''}css`,
            }),
            new webpack.ProgressPlugin(),
            ...htmlPlugin({
                pagesPath: utils.paths.pages,
                templatePath: utils.paths.templates,
                outputPath: utils.paths.html,
                data: {},
                filters: {},
            })
        ],
        output: {
            path: utils.paths.dist['app'],
            filename: `${utils.paths.bundles}/js/[name].${prod ? '[chunkhash:5].' : ''}js`,
            chunkFilename: `${utils.paths.bundles}/js/[name].${prod ? '[chunkhash:5].' : ''}js`,
            publicPath: '/'
        },
        optimization: {
            namedChunks: true,
            splitChunks: {
                chunks: 'all',
                maxInitialRequests: Infinity,
                minSize: 0,
                cacheGroups: {
                    default: false,
                    vendors: false,
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendors",
                        chunks: 'all'
                    },
                },
            },
        }
    }

    if (prod) {
        config.mode = 'production';
        config.plugins = config.plugins.concat([
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    discardComments: {
                        removeAll: true
                    }
                },
                canPrint: true
            }),
        ]);
        config.optimization.minimize = true;
    } else if (dev) {
        config.mode = 'development';
        config.devtool = 'inline-source-map';
        config.devServer = {
            // port: 8080,
            writeToDisk: true,
            compress: true,
            liveReload: true,
            hot: false,
            historyApiFallback: {
                rewrites: [
                    { from: /^\/$/, to: 'index.html' }
                    // { from: /(.*)/, to: '/error/index.html' }
                ],
                disableDotRule: true,
            },
            watchContentBase: true,
            overlay: true,
            contentBase: `${utils.paths.dist['app']}/${utils.paths.html}`,
            inline: true,
            disableHostCheck: true,
            stats: false
        };
    }

    return config
};
