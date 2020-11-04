const fs                 = require("fs");
const glob_entries       = require('webpack-glob-folder-entries');
const HtmlWebpackPlugin  = require("html-webpack-plugin");

/**
 * Generate Nunjucks template to HTML
 * @param {String} pagesBlobPath path.resolve(__dirname, './templates/** /')
 * @param {String} pagesPath path.resolve(__dirname, './templates/pages')
 * @returns {Array} array with HtmlWebpackPlugin
 */
function generateNunjucksHtml(pagesBlobPath, pagesPath, optionsHmlPlugin) {
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
                filename: `./${page}.html`,
                inject: optionsHmlPlugin && optionsHmlPlugin.inject || optionsHmlPlugin.inject === false ? optionsHmlPlugin.inject : true,
                minify: optionsHmlPlugin && optionsHmlPlugin.minify || optionsHmlPlugin.minify === false ? optionsHmlPlugin.minify : true,
                chunks: optionsHmlPlugin && optionsHmlPlugin.chunks && optionsHmlPlugin.chunks.length > 0 ? optionsHmlPlugin.chunks : chunks,
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