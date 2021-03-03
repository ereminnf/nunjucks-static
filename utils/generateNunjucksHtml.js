const fs                 = require("fs");
const glob_entries       = require('webpack-glob-folder-entries');
const HtmlWebpackPlugin  = require("html-webpack-plugin");

/**
 * Generate Nunjucks template to HTML
 * @param {String} pagesBlobPath path.resolve(__dirname, './templates/** /')
 * @param {String} pagesPath path.resolve(__dirname, './templates/pages')
 * @param {String} optionsHmlPlugin  HtmlWebpackPlugin options
 * @returns {Array} array with HtmlWebpackPlugin
 */
function generateNunjucksHtml(pagesBlobPath, pagesPath, optionsHmlPlugin = {}) {
    let entries = glob_entries(pagesBlobPath, true);
    let pagesList = new Array();

    for (let pages in entries){
        pagesList.push(pages);
    }

    pagesList = pagesList.map(page => {
        let parts;
        let name;
        let extension;
        let chunks = [];

        chunks.push(page);

        // add chunks for entry point
        if (optionsHmlPlugin.chunks) {
            for (const pageChunk in optionsHmlPlugin.chunks) {
                if (page === pageChunk) {
                    chunks = chunks.concat(optionsHmlPlugin.chunks[pageChunk]);
                }
            }
        }

        if (fs.existsSync(`${pagesPath}/${page}/${page}.njk`)) {
            parts = `${page}.njk`.split(".");
            name = parts[0];
            extension = parts[1];
        } else if (fs.existsSync(`${pagesPath}/${page}/index.njk`)) {
            parts = 'index.njk'.split(".");
            name = parts[0];
            extension = parts[1];
        }

        if (fs.existsSync(`${pagesPath}/${page}/${name}.${extension}`)) {
            return new HtmlWebpackPlugin({
                template: `${pagesPath}/${page}/${name}.${extension}`,
                filename: `${optionsHmlPlugin.filepath || './'}${page}.html`,
                inject: optionsHmlPlugin.inject || optionsHmlPlugin.inject === false ? optionsHmlPlugin.inject : false,
                minify: optionsHmlPlugin.minify || optionsHmlPlugin.minify === false ? optionsHmlPlugin.minify : true,
                chunks: chunks,
            });
        } else {
            return null;
        }
    });

    pagesList = pagesList.filter(page => {
        if (page) {
            return page;
        }
    })

    return pagesList;
}

module.exports = generateNunjucksHtml