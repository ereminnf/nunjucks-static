const glob_entries = require('webpack-glob-folder-entries')

/**
 * Generate folders for nunjucks
 * @param {String} pagesBlobPath path.resolve(__dirname, './templates/** /')
 * @returns {Array} array with folder paths
 */
function generateFolderList(pagesBlobPath){
    let entries = glob_entries(pagesBlobPath, true);
    let folderList = new Array();

    for (let folder in entries){
       folderList.push(entries[folder]);
    }

    return folderList;
}

module.exports = generateFolderList