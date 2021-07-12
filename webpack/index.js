const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const filters = require('../filters');
const path = require('path');

const rootPath = path.join(__dirname, '..');

const utils = {
    paths: {
        root: rootPath,
        client: path.join(rootPath, 'app'),
        dist: {
            app: path.join(rootPath, 'dist'),
        },
        pages: path.join(rootPath, 'app', 'templates', 'pages'),
        templates: path.join(rootPath, 'app', 'templates'),
        postcss: path.join(rootPath, 'webpack', 'postcss.config.js'),
        assets: 'assets',
        html: 'html',
        bundles: 'bundles',
        loader: path.join(rootPath, 'index.js')
    },
    filters,
    chunks: {},
    rules: {
        js: () => {
            return {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        },
        ts: () => {
            return {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader'
                }
            }
        },
        scss: () => {
            return {
                test: /\.(sa|sc|c)ss$/,
                exclude: [/node_modules/, /\.module\.(sa|sc|c)ss$/],
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: false,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            esModule: false,
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            postcssOptions: {
                                config: utils.paths.postcss
                            }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            additionalData: ``,
                        }
                    },
                ]
            }
        },
        scssModule: () => {
            return {
                test: /\.module\.(sa|sc|c)ss$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: false,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            url: false,
                            esModule: false,
                            importLoaders: 2,
                            modules: {
                                getLocalIdent: getCSSModuleLocalIdent,
                            },
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            postcssOptions: {
                                config: utils.paths.postcss
                            }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                ]
            }
        },
        fileFonts: () => {
            return {
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+)?$/,
                loader: 'file-loader',
                options: {
                    name: '[name]-[hash:4].[ext]'
                }
            }
        },
        fileImg: () => {
            return {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: `${utils.paths.assets}/[name]-[hash:4].[ext]`
                }
            }
        },
        nunjucks: () => {
            return {
                test: /\.(html|njk|nunjucks)$/,
                exclude: [/node_modules/],
                use: [
                    'html-loader',
                    {
                        loader: utils.paths.loader,
                        options: {
                            path: utils.paths.templates
                        }
                    }
                ]
            }
        }
    },
    extensions: () => {
        return [ '.ts', '.tsx', '.js', '.jsx']
    },
    alias: () => {
        return {
            '_app': path.resolve(__dirname, '../app')
        }
    }
}

exports.utils = utils