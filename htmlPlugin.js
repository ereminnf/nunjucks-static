const fs                 = require("fs");
const HtmlWebpackPlugin  = require("html-webpack-plugin");
const generateGlobPath   = require("./src/getFiles.js");
const path = require('path');
const NunjucksPlugin = require("./src/nunjucksPlugin.js");

/**
 * Generate HtmlWebpackPlugin
 * @param {object} option
 * @param {string} option.pagesPath
 * @param {string} option.templatePath
 * @param {object} option.data
 * @param {object} option.filters
 * @param {object} option.filepath
 *
 * @param {object} htmlOption
 * @param {object} njkOption
 */
function htmlPlugin(opt, htmlOpt, njkOption) {
    try {
        const options = Object.assign({
            outputPath: ''
        }, opt);

        const htmlOption = Object.assign({
            minify: false,
            inject: false,
            chunks: {},
            filename: ''
        }, htmlOpt);

        const pageFolderName = path.basename(options.pagesPath);

        // get only index.njk
        let pages = generateGlobPath(options.pagesPath + '/**/*').files.filter(item => {
            for (const key in item) {
                return key.split('.').shift() === 'index';
            }

            return false
        }).map(item => {
            const page = {};

            // ex: ../about/index.njk
            page.path = item['index.njk'];
            // ex: about
            page.name = path.basename(path.join(item['index.njk'], '..'));
            // ex: /about/
            page.pathToBuild = page.path.split(pageFolderName).pop().replace('index.njk', '');

            return page;
        });

        pages = pages.map(page => {
            let chunks = htmlOption.chunks[page.name];

            if (chunks) {
                chunks.push(page.name);
            }

            if (page.name === 'index') {
                htmlOption.filename = `${options.outputPath}/index.html`;
            } else {
                htmlOption.filename = `${options.outputPath}${page.pathToBuild}index.html`;
            }

            htmlOption.template = path.join(`${options.pagesPath}${page.pathToBuild}`, 'index.njk');
            htmlOption.chunks = chunks;

            return new HtmlWebpackPlugin(htmlOption);
        })

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