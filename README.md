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

starter kit: https://github.com/truerk/starter-kit-nunjucks

**webpack.config.js**

```js
const generateHtmlPlugin = require('nunjucks-template-loader/utils/generateHtmlPlugin');
const templatesPath = path.join(__dirname, 'templates');
const pagesPath = path.join(templatesPath, 'pages');
```

generateNunjucksHtml - generating html file using HTML Webpack Plugin

templatesPath - path to your templates

pagesPath - path to your page templates

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.html$|njk|nunjucks/,
                exclude: [/node_modules/, /(src)/],
                use: [
                    'html-loader',
                    {
                        loader: 'nunjucks-template-loader',
                        options: {
                            path: templatesPath
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        ...
    ].concat(generateHtmlPlugin(pagesPath, {
        minify: true,
        inject:  true,
        filepath: '/',
        chunks: {}
    }))
}
```

**with data and filters**
```js
function shorten(value, count) {
   return value.slice(0, count || 5);
}

module.exports = {
    module: {
        rules: [
            {
                test: /\.html$|njk|nunjucks/,
                exclude: [/node_modules/, /(src)/],
                use: [
                    'html-loader',
                    {
                        loader: 'nunjucks-template-loader',
                        options: {
                            path: templatesPath,
                            filters: {
                                shorten
                            },
                            data: {
                                title: 'ntl',
                                foo: 'bar'
                            }
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        ...
    ].concat(generateHtmlPlugin(pagesPath, {
        ...options
    }))
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
<head>{{ title }}</head>
<body>

    {% include "components/header.njk" %}

    <div id="app">
        {% block content %}{% endblock %}
    </div>

    {% include "components/footer.njk" %}

</body>
</html>
```

**pages**
```markup
{% extends "layout.njk" %}

{% block content %}
   <div class="content">
        <h2>{{ title }}</h2>
        <div>{{ foo | shorten(3) }}</div>
   </div>
{% endblock %}
```
