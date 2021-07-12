[npm-url]: https://www.npmjs.com/package/nunjucks-template-loader
[npm-image]: https://img.shields.io/npm/v/nunjucks-template-loader?color=blue

[logo-url]: https://github.com/truerk/nunjucks-template-loader
[logo-image]: https://i.ibb.co/ZLJQnqP/nunjucks-template-loader.webp

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://github.com/truerk/nunjucks-template-loader/blob/master/LICENSE

[size-image]: https://img.shields.io/npm/dm/nunjucks-template-loader.svg
[size-url]: https://www.npmjs.com/package/nunjucks-template-loader

# Nunjucks loader [![NPM version][npm-image]][npm-url] [![GitHub license][license-image]][license-url] [![NPM size][size-image]][size-url]

Webpack loader for Nunjucks

## Install

```js
npm i --save-dev nunjucks-template-loader
```

## Usage

used with html-loader and html-webpack-plugin

**webpack.config.js**

```js
const htmlPlugin = require('nunjucks-template-loader/htmlPlugin');
const paths = {
    templates: path.join(__dirname, 'templates'),
    pages: path.join(paths.templates, 'pages'),
    output: '',
};
```

htmlPlugin - generating html file using HTML Webpack Plugin

paths.templates - path to your templates

paths.pages - path to your page templates

paths.output - path to output html

```js
module.exports = {
    module: {
        entry: {
            firstEntry: [
                `firstEntry/index.js`,
            ],
            secondEntry: [
                `secondEntry/index.js`,
            ],
            index: [
                `index/index.js`,
            ],
            about: [
                `about/index.js`,
            ]
        },
        rules: [
            {
                test: /\.(html|njk|nunjucks)$/,
                exclude: [/node_modules/],
                use: [
                    'html-loader',
                    {
                        loader: 'nunjucks-template-loader',
                        options: {
                            path: paths.templates
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        ...htmlPlugin({
            pagesPath: paths.pages,
            templatePath: paths.templates,
            outputPath: paths.output,
            data: {
                foo: 'bar',
                title: 'site-title'
            },
            filters: {
                shorten: function (value, count) {
                    return value.slice(0, count || 5);
                }
            }
        }, {
            // ...HTML Webpack Plugin options
            minify: false,
            inject: false,
            chunks: {
                index: [
                    'firstEntry',
                    'secondEntry'
                ],
                about: [
                    'firstEntry'
                ]
            }
        }, {
            // ...nunjucks options
        })
    ]
}
```

**example project structure**
```
app
├── ...
├── templates/
│     ├── components/
│     │     ├── header.njk
│     │     └── footer.njk
│     ├── pages/
│     │     ├── index/
│     │     │     └── index.njk
│     │     └── about/
│     │            └── index.njk
│     └── layout.njk
└── ...
```

**layout.njk**
```markup
<!DOCTYPE html>
<html lang="en">
<head>
    <title>{{ title }}</title>

    {% for item in bundles.css %}
        <link rel="stylesheet" href="{{ item }}">
    {% endfor %}
</head>
<body>

    {% include "components/header.njk" %}

    <main class="main">
        {% block content %}{% endblock %}
    </main>

    {% include "components/footer.njk" %}

    {% for item in bundles.js %}
        <link rel="stylesheet" href="{{ item }}">
    {% endfor %}
</body>
</html>
```

**pages**
```markup
{% extends "layout.njk" %}

{% block content %}
   <div class="content">
        <div>{{ foo | shorten(3) }}</div>
   </div>
{% endblock %}
```
