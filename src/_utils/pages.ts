import { getFiles } from './files'

export interface GetPagesProps {
    pagesPath: string
}

export function getPages(props: GetPagesProps, variables?: any) {
    const { pagesPath } = props

    const pages = getFiles(`${pagesPath}/*`).folders.map((item) => {
        const data = Object.assign(
            {},
            {
                name: '',
                filePath: '',
                buildPath: '',
                pagePath: '',
                childPath: '',
            },
            variables
        )

        for (const key in item) {
            data.name = data.name.length ? `${data.name}_${key}` : key
            data.filePath = `${item[key]}/index.njk`
            data.pagePath = `${item[key]}`

            if (key === 'main') {
                data.buildPath = `/index.html`
            } else {
                data.buildPath = `${data.childPath}/${key}/index.html`
                data.childPath = `${data.childPath}/${key}`
            }
        }

        return data
    })

    let pagesWithChildren = [...pages]

    pages.forEach((item) => {
        const pages = getPages({ pagesPath: `${item.pagePath}/pages` }, item)

        if (pages.length) {
            pagesWithChildren = pagesWithChildren.concat(pages)
        }
    })

    return pagesWithChildren
}
