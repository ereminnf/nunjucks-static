const fs                 = require("fs");
const HtmlWebpackPlugin  = require("html-webpack-plugin");
const generateGlobPath   = require("./generateGlobPath.js");


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
            filepath: '/',
            filename: ''
        }, optionsHmlPlugin)
        const chunksForPage = option.chunks;

        let pageFolders = generateGlobPath(pagesPath + '/*').folders;
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
            let chunks = chunksForPage[page];

            chunks.push(page);

            // get page template partials
            if (fs.existsSync(`${pagesPath}/${page}/index.njk`)) {
                parts = 'index.njk'.split(".");
                name = parts[0];
                extension = parts[1];
            } else {
                throw Error('page template not found')
            }

            const filename = `${option.filepath}${page === 'index' ? '' : `${page}/`}index.html`;

            option.template = `${pagesPath}/${page}/${name}.${extension}`;
            option.filename = filename;
            option.chunks = chunks;

            return new HtmlWebpackPlugin(option);
        });

        return pages;
    } catch (e) {
        throw e;
    }
}


module.exports = generateHtmlPlugin