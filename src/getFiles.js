const glob = require('glob');
const fs = require('fs');
const path = require('path');


/**
 * Generate glob path
 * @param {string} matches
 */
function generateGlobPath(matches) {
    try {
        const pathes = glob.sync(matches);

        const folders = [];
        const files = [];

        pathes.forEach(file => {
            if (fs.statSync(file).isDirectory()) {
                folders.push({
                    [path.basename(file)]: file
                });
            } else if (fs.statSync(file).isFile()) {
                files.push({
                    [path.basename(file)]: file
                });
            }
        })

        return {folders, files};
    } catch (e) {
        throw e;
    }
}


module.exports = generateGlobPath