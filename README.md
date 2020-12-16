[npm-url]: https://www.npmjs.com/package/nunjucks-template-loader
[npm-image]: https://img.shields.io/npm/v/nunjucks-template-loader?color=blue

[logo-url]: https://github.com/truerk/nunjucks-template-loader
[logo-image]: https://i.ibb.co/ZLJQnqP/nunjucks-template-loader.webp

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://github.com/truerk/nunjucks-template-loader/blob/master/LICENSE

[size-image]: https://img.shields.io/npm/dm/nunjucks-template-loader.svg
[size-url]: https://www.npmjs.com/package/nunjucks-template-loader

# Nunjucks loader [![NPM version][npm-image]][npm-url] [![GitHub license][license-image]][license-url] [![NPM size][size-image]][size-url]

Webpack loader for nunjucks

## Install

```js
npm i nunjucks-template-loader
```

## Usage

used with webpack-glob-folder-entries and html-webpack-plugin

starter kit: https://github.com/truerk/starter-kit-nunjucks

**webpack.config.js**

```js
const generateNunjucksHtml  = require('nunjucks-template-loader/utils/generateNunjucksHtml');
const nunjucksFilters = require('nunjucks-template-loader/filters');
const templateGlobPath = path.resolve(__dirname, './templates/**/')
const pagesGlobPath = path.resolve(__dirname, './templates/pages/**/')
const pagesPath = path.resolve(__dirname, './templates/pages')
```

generateNunjucksHtml - generating html file using HTML Webpack Plugin

nunjucksFilters - object with example filters (you can use your filters)

templateGlobPath - glob path to your templates

pagesGlobPath - glob path to your page templates

pagesPath - path to your page templates


```js
module.exports = {
   module: {
      rules: [
         {
            test: /\.html$|njk|nunjucks/,
            exclude: [/(node_modules)/, /(src)/],
            use: [
               'html-loader',
               {
                  loader: 'nunjucks-template-loader',
                  options: {
                     paths: templateGlobPath
                  }
               }
            ]
         }
      ]
   },
   plugins: [
      ...
   ].concat(generateNunjucksHtml(pagesGlobPath, pagesPath, {
      ...
      // html-webpack-plugin options (minify, inject, chunks)
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
            exclude: [/(node_modules)/, /(src)/],
            use: [
               'html-loader',
               {
                  loader: 'nunjucks-template-loader',
                  options: {
                     paths: templateGlobPath,
		     data: {
		        title: 'projectTitle',
		        foo: 'indexBar'
                     },
		     filters: {
		        shorten
		     }
                  }
               }
            ]
         }
      ]
   },
   plugins: [
      ...
   ].concat(generateNunjucksHtml(pagesGlobPath, pagesPath, {
      ...
      // html-webpack-plugin options (minify, inject, chunks)
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
        <p>shorten filters example:</p>
        <div>{{ foo | shorten(3) }}</div>
   </div>
{% endblock %}
```
