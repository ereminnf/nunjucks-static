import HtmlWebpackPlugin from 'html-webpack-plugin'
import { renderToString } from 'src/_utils/nunjucks'

export interface NunjucksPluginProps {
    options: {
        templatePath: string
        data: any
        filters: any
    }
}

export class NunjucksPlugin {
    options: NunjucksPluginProps['options']

    constructor(props: NunjucksPluginProps) {
        this.options = props.options
    }

    apply(compiler: any) {
        compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
            HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync('NunjucksPlugin', (data, cb) => {
                data.html = renderToString({
                    template: data.html,
                    path: this.options.templatePath,
                    data: Object.assign(
                        {},
                        {
                            bundles: this.getBundles(JSON.parse((data.plugin as any).assetJson)),
                        },
                        this.options.data
                    ),
                    filters: this.options.filters,
                })

                cb(null, data)
            })
        })
    }

    getBundles(files: string[]) {
        let bundles = {
            css: {},
            js: {},
        }

        files.forEach((file) => {
            const ext = file.split('/').pop().split('.')[file.split('.').length - 1]
            const name = file.split('/').pop().split('.')[0]

            if (name.length > 1) {
                bundles[ext][name] = file
            }
        })

        return bundles
    }
}
