const getFiles = require("./getFiles");
const path = require('path');

const rootPath = path.join(__dirname, '..');
const pagesPath = path.join(rootPath, 'app/templates/pages');

function getPages(pagesPath, dataGlobal = {}) {
    /** Собираем страницы 1 уровня */
    let pages = getFiles(`${pagesPath}/*`).folders;

    /** Собираем данные по страницам */
    pages = pages.map(item => {
        const data = Object.assign({
            name: '',
            filePath: '',
            buildPath: '',
            pagePath: '',
            childPath: ''
        }, dataGlobal)

        for (const key in item) {
            data.name = data.name.length ? `${data.name}_${key}` : key;
            data.filePath = `${item[key]}/index.njk`;
            data.pagePath = `${item[key]}`;

            if (key === 'index') {
                data.buildPath = `/index.html`;
            } else {
                data.buildPath = `${data.childPath}/${key}/index.html`;
                data.childPath = `${data.childPath}/${key}`;
            }
        }

        return data
    });

    let pagesWithChildren = [...pages];

    pages.forEach(item => {
        const pages = getPages(`${item.pagePath}/pages`, item);

        if (pages.length) {
            pagesWithChildren = pagesWithChildren.concat(pages);
        }
    })

    return pagesWithChildren;
}

// const pages = getPages(pagesPath);

module.exports = getPages