[npm-url]: https://www.npmjs.com/package/nunjucks-static
[npm-image]: https://img.shields.io/npm/v/nunjucks-static?color=blue
[logo-url]: https://github.com/ereminnf/nunjucks-static
[logo-image]: https://i.ibb.co/ZLJQnqP/nunjucks-static.webp
[size-image]: https://img.shields.io/npm/dm/nunjucks-static.svg
[size-url]: https://www.npmjs.com/package/nunjucks-static

# Nunjucks static [![NPM version][npm-image]][npm-url] [![NPM size][size-image]][size-url]

## Install

```js
npm i --save-dev nunjucks-static
```

## Usage

### webpack.config.js

```js
const { getNunjucksStaticPlugins } = require('nunjucks-static')
const path = require('path')

const paths = {
    templates: path.join(__dirname, 'templates'),
    pages: path.join(paths.templates, 'pages'),
    output: '',
}

module.exports = {
    // ...
    module: {
        rules: [
            {
                test: /\.(html|njk|nunjucks)$/,
                exclude: [/node_modules/],
                use: [
                    'html-loader',
                    {
                        loader: 'nunjucks-static',
                        options: {
                            path: paths.templates,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        ...getNunjucksLoaderPlugins({
            pagesPath: paths.pages,
            templatePath: paths.templates,
            outputPath: paths.output,
            data: {
                foo: 'bar',
            },
            filters: {
                shorten: function (value, count) {
                    return value.slice(0, count || 5)
                },
            },
        }),
    ],
}
```

### Project structure

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
│     │            ├── pages/
│     │            │      └── us/
│     │            │            └── index.njk
│     │            └── index.njk
│     └── layout.njk
└── ...
```

### layout

```twig
<!DOCTYPE html>
<html lang="en">
<head>
    <title>{{ title }}</title>

    {% for name, item in bundles.css %}
        <link rel="stylesheet" href="{{ item }}">
    {% endfor %}
</head>
<body>

    {% include "components/header.njk" %}

    <main class="main">
        {% block content %}{% endblock %}
    </main>

    {% include "components/footer.njk" %}

    {% for name, item in bundles.js %}
        <script src="{{ item }}"></script>
    {% endfor %}
</body>
</html>
```

### Page

```twig
{% extends "layout.njk" %}

{% block content %}
   <div class="content">
        <div>{{ foo | shorten(3) }}</div>
        <p>bundles:</p>
        {{ bundles | dump | safe }}
   </div>
{% endblock %}
```
