import utils from 'loader-utils'
import path from 'path'
import { getFiles } from '../_utils/files'

export function nunjucksLoader(template: any) {
    this.cacheable()

    const callback = this.async()
    const options = utils.getOptions(this)
    const pathTemplate = options.path

    getFiles(pathTemplate + '/**')
        .files.map((item) => {
            for (const key in item) {
                return item[key]
            }
        })
        .forEach((item) => {
            if (item) {
                this.addDependency(path.normalize(item))
            }
        })

    callback(null, template)
}
