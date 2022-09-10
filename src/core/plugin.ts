import HtmlWebpackPlugin from 'html-webpack-plugin'
import { renderToString } from '../_utils/nunjucks'

export interface NunjucksStaticPluginProps {
    options: {
        templatePath: string
        data: any
        filters: any
    }
}

export class NunjucksStaticPlugin {
    options: NunjucksStaticPluginProps['options']

    constructor(props: NunjucksStaticPluginProps) {
        this.options = props.options
    }

    apply(compiler) {
        compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
            let bundle = []

            HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync(
                'NunjucksStaticPlugin',
                (data, cb) => {
                    bundle = [...(data.assets.js || []), ...(data.assets.css || [])]

                    cb(null, data)
                }
            )

            HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync('NunjucksStaticPlugin', (data, cb) => {
                data.html = renderToString({
                    template: data.html,
                    path: this.options.templatePath,
                    data: Object.assign(
                        {},
                        {
                            bundle: this.getBundle(bundle),
                        },
                        this.options.data
                    ),
                    filters: this.options.filters,
                })

                cb(null, data)
            })
        })
    }

    getBundle(files: string[]) {
        let bundle = {
            css: {},
            js: {},
        }

        files.forEach((file) => {
            const ext = file.split('/').pop().split('.')[file.split('.').length - 1]
            const name = file.split('/').pop().split('.')[0]

            if (name.length > 1) {
                bundle[ext][name] = file
            }
        })

        return bundle
    }
}
