import nunjucks from 'nunjucks'

export interface RenderToStringProps {
    template: string
    path: string
    data: any
    filters: any
}

export function renderToString(props: RenderToStringProps, options?: nunjucks.ConfigureOptions) {
    const { template, path, data, filters } = props

    const njk = nunjucks.configure(
        path,
        Object.assign(
            {},
            {
                autoescape: true,
                noCache: true,
                watch: false,
            },
            options
        )
    )

    for (const key in filters) {
        njk.addFilter(key, filters[key])
    }

    const html = njk.renderString(template, data)

    return html
}
