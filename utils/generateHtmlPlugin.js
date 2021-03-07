const fs                 = require("fs");
const HtmlWebpackPlugin  = require("html-webpack-plugin");
const generateGlobPath   = require("./generateGlobPath.js");
const path = require('path');


/**
 * Generate HtmlWebpackPlugin
 * @param {string} pagesPath path to pages
 * @param {object} optionsHmlPlugin
 * @returns HtmlWebpackPlugin[]
 */
function generateHtmlPlugin(pagesPath, optionsHmlPlugin = {}) {
    try {
        const option = Object.assign({
            minify: true,
            inject: true,
            chunks: {},
            filepath: '',
            filename: ''
        }, optionsHmlPlugin)
        const chunksForPage = option.chunks;
        const folderNamePath = path.basename(pagesPath)

        let matchesPage = generateGlobPath(pagesPath + '/**/*').files.filter(item => {
            for (const key in item) {
                return key.split('.').shift() === 'index';
            }

            return false
        }).map(item => {
            const page = {};

            page.path = item['index.njk'];
            page.name = path.basename(path.join(item['index.njk'], '..'));
            page.pathToBuild = page.path.split(folderNamePath).pop().replace('index.njk', '');

            return page;
        });

        pages = matchesPage.map(page => {
            let chunks = chunksForPage[page.name];

            chunks.push(page.name);

            if (page.name === 'index') {
                option.filename = `${option.filepath}/index.html`;
            } else {
                option.filename = `${option.filepath}${page.pathToBuild}index.html`;
            }

            option.template = path.join(`${pagesPath}${page.pathToBuild}`, 'index.njk');
            option.chunks = chunks;

            return new HtmlWebpackPlugin(option);
        })

        return pages;
    } catch (e) {
        throw e;
    }
}


module.exports = generateHtmlPlugin