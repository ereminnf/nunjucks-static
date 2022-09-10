import HtmlWebpackPlugin from 'html-webpack-plugin'
import { NunjucksStaticPlugin } from '../core/plugin'
import { getPages } from '../_utils/pages'

interface GetNunjucksStaticPluginsProps {
    pagesPath: string
    templatePath: string
    outputPath: string
    data: any
    filters: any
}

export function getNunjucksStaticPlugins(props?: GetNunjucksStaticPluginsProps) {
    const options = Object.assign(
        {},
        {
            inject: false,
            outputPath: '',
            chunks: 'all' as any,
            filename: '',
            template: '',
        },
        props
    )

    const pages = getPages({ pagesPath: options.pagesPath }).map((page: any) => {
        const htmlOptions = { ...options }

        htmlOptions.filename = `${options.outputPath}${page.buildPath}`
        htmlOptions.template = page.filePath

        return new HtmlWebpackPlugin(htmlOptions)
    })

    pages.push(
        new NunjucksStaticPlugin({
            options,
        }) as any
    )

    return pages
}
