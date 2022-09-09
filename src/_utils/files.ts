import glob from 'glob'
import fs from 'fs'
import path from 'path'

export function getFiles(matches: string) {
    try {
        const pathes = glob.sync(matches)

        const folders = []
        const files = []

        pathes.forEach((file) => {
            if (fs.statSync(file).isDirectory()) {
                folders.push({
                    [path.basename(file)]: file,
                })
            } else if (fs.statSync(file).isFile()) {
                files.push({
                    [path.basename(file)]: file,
                })
            }
        })

        return { folders, files }
    } catch (e) {
        throw e
    }
}
