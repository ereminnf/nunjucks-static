import HtmlWebpackPlugin from 'html-webpack-plugin'
import { getPages } from 'src/_utils/pages'
import { NunjucksPlugin } from './nunjucks'

interface GetNunjucksLoaderPluginsProps {
    pagesPath: string
    templatePath: string
    outputPath: string
    data: any
    filters: any
}

export function getNunjucksLoaderPlugins(props?: GetNunjucksLoaderPluginsProps) {
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
        new NunjucksPlugin({
            options,
        })
    )

    return pages
}
