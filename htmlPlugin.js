const HtmlWebpackPlugin = require("html-webpack-plugin");
const NunjucksPlugin = require("./src/nunjucksPlugin.js");
const getPages = require("./src/getPages.js");

/**
 * Generate HtmlWebpackPlugin
 * @param {object} option
 * @param {string} option.pagesPath
 * @param {string} option.templatePath
 * @param {object} option.data
 * @param {object} option.filters
 * @param {object} option.outputPath
 *
 * @param {object} njkOption
 */
function htmlPlugin(opt, njkOption) {
    try {
        const options = Object.assign({
            inject: false,
            outputPath: '',
            chunks: {}
        }, opt);

        const pages = getPages(options.pagesPath).map(page => {
            const opt = { ...options };

            opt.filename = `${options.outputPath}${page.buildPath}`;
            opt.template = page.filePath;
            opt.chunks = 'all';

            return new HtmlWebpackPlugin(opt);
        });

        pages.push(new NunjucksPlugin({
            options,
            njkOption
        }));

        return pages;
    } catch (e) {
        throw e;
    }
}

module.exports = htmlPlugin;