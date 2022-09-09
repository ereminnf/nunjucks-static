[npm-url]: https://www.npmjs.com/package/@ereminnf/nunjucks-loader
[npm-image]: https://img.shields.io/npm/v/@ereminnf/nunjucks-loader?color=blue
[logo-url]: https://github.com/truerk/@ereminnf/nunjucks-loader
[logo-image]: https://i.ibb.co/ZLJQnqP/@ereminnf/nunjucks-loader.webp
[size-image]: https://img.shields.io/npm/dm/@ereminnf/nunjucks-loader.svg
[size-url]: https://www.npmjs.com/package/@ereminnf/nunjucks-loader

# Nunjucks loader [![NPM version][npm-image]][npm-url] [![NPM size][size-image]][size-url]

## Install

```js
npm i --save-dev @ereminnf/nunjucks-loader
```

## Usage

```
npm i && npm run start
```

### webpack.config.js

```js
const { getNunjucksLoaderPlugins } = require('@ereminnf/nunjucks-loader')
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
                        loader: '@ereminnf/nunjucks-loader',
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
