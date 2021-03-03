const fs                 = require("fs");
const HtmlWebpackPlugin  = require("html-webpack-plugin");
const generatePath       = require("./generatePath.js");


/**
 * Generate Nunjucks template
 */
function generateHtml(pagesPath, optionsHmlPlugin = {}) {
    const option = Object.assign({
        minify: true,
        inject: true,
        chunks: {},
        filepath: '/',
        filename: ''
    }, optionsHmlPlugin)

    let pageFolders = generatePath(pagesPath + '/*').folders;
    let pages = [];

    for (const i in pageFolders) {
        for (let name in pageFolders[i]){
            pages.push(name)
        }
    }

    pages = pages.map(page => {
        let parts;
        let name;
        let extension;
        let chunks = [];

        chunks.push(page);

        // add chunks for entry point
        for (const pageChunk in option.chunks) {
            if (page === pageChunk) {
                chunks = chunks.concat(option.chunks[pageChunk]);
            }
        }

        // get page template partials
        if (fs.existsSync(`${pagesPath}/${page}/index.njk`)) {
            parts = 'index.njk'.split(".");
            name = parts[0];
            extension = parts[1];
        } else {
            throw Error('page template not found')
        }

        const filename = `${option.filepath}${page === 'index' ? '' : `${page}/`}index.html`;

        return new HtmlWebpackPlugin({
            template: `${pagesPath}/${page}/${name}.${extension}`,
            filename: filename,
            inject: option.inject,
            minify: option.minify,
            chunks: chunks,
        });
    });

    return pages;
}


module.exports = generateHtml