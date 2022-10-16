[npm-url]: https://www.npmjs.com/package/nunjucks-static
[npm-image]: https://img.shields.io/npm/v/nunjucks-static?color=blue
[logo-url]: https://github.com/ereminnf/nunjucks-static
[logo-image]: https://i.ibb.co/ZLJQnqP/nunjucks-static.webp
[size-image]: https://img.shields.io/npm/dm/nunjucks-static.svg
[size-url]: https://www.npmjs.com/package/nunjucks-static

# Nunjucks static

[![NPM version][npm-image]][npm-url] [![NPM size][size-image]][size-url]

This package adds nunjucks support for webpack as an HTML templating engine. It also supports the development of a multi-page site with nested pages with static html generation.

Inside nunjucks templates, a "bundle" variable will be available, which will contain the entry files of the build.

In the "data" property in the getNunjucksStaticPlugins function, you can pass any variables in the object view, where the key is the name of the variable that will be available in the nunjucks templates.

-   Webpack support: only 5+
-   New 4+ version tested on node 16 version

## Install

```js
npm i --save-dev nunjucks-static
```

## Usage

### Custom webpack.config.js

```js
const { getNunjucksStaticPlugins } = require('nunjucks-static')
const path = require('path')

const resolvePath = (...pathResolve) => {
    return path.join(process.cwd(), ...pathResolve)
}

const paths = {
    src: resolvePath('src'),
    build: resolvePath('build'),
    templates: resolvePath('templates'),
    pages: resolvePath('templates/pages'),
    output: resolvePath('build/html'),
}

// Add nunjucks-static loader and plugin to webpack config
module.exports = {
    // ...
    entry: {
        main: resolvePath(paths.src, 'pages/main'),
        about: resolvePath(paths.src, 'pages/about'),
        error: resolvePath(paths.src, 'pages/error'),
    },
    output: {
        path: paths.build,
    },
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
        ...getNunjucksStaticPlugins({
            pagesPath: paths.pages,
            templatePath: paths.templates,
            outputPath: paths.output,
            data: {
                title: 'Nunjucks-static',
            },
            filters: {
                shorten: function (value, count) {
                    return value.slice(0, count || 5)
                },
            },
        }),
    ],
    devServer: {
        // ...
        historyApiFallback: {
            rewrites: [
                {
                    from: /./,
                    to: `/error/index.html`,
                },
            ],
            disableDotRule: true,
        },
    },
}
```

### Project structure example

```
root
├── ...
├── templates/
│     ├── components/
│     │     ├── header/
│     │     │     └── index.njk
│     │     └── footer/
│     │           └── index.njk
│     ├── pages/
│     │     ├── main/
│     │     │     └── index.njk
│     │     ├── about/
│     │     │     ├── pages/
│     │     │     │      └── us/
│     │     │     │            └── index.njk
│     │     │     └── index.njk
│     │     └── error/
│     │           └── index.njk
│     └── layout.njk
└── ...
```

### layout

```twig
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="description" content="{{ title }}"/>

        <title>{{ title }}</title>

        {% block css %}
            {% for name, item in bundle.css %}
                <link rel="stylesheet" href="{{ item }}">
            {% endfor %}
        {% endblock %}
    </head>
    <body>

        {% include "components/header/index.njk" %}

        <main class="content">
            {% block content %}{% endblock %}
        </main>

        {% include "components/footer/index.njk" %}

        {% block js %}
            {% for name, item in bundle.js %}
                <script src="{{ item }}"></script>
            {% endfor %}
        {% endblock %}
    </body>
</html>
```

### Page

```twig
{% extends "layout.njk" %}

{% block content %}
   <div class="page page-main">
        <h1>Page main</h1>

        <div>{{ foo | shorten(3) }}</div>
        <p>bundles:</p>
        {{ bundles | dump | safe }}
   </div>
{% endblock %}

{% block css %}
    <link rel="stylesheet" href="{{ bundle['css']['main'] }}">
{% endblock %}

{% block js %}
    <script src="{{ bundle['js']['main'] }}"></script>
{% endblock %}
```

```twig
{% extends "layout.njk" %}

{% block content %}
   <div class="page page-about">
        <h1>Page about</h1>
   </div>
{% endblock %}

{% block css %}
    <link rel="stylesheet" href="{{ bundle['css']['about'] }}">
{% endblock %}

{% block js %}
    <script src="{{ bundle['js']['about'] }}"></script>
{% endblock %}
```

```twig
{% extends "layout.njk" %}

{% block content %}
   <div class="page page-error">
        <h1>Page error</h1>
   </div>
{% endblock %}

{% block css %}
    <link rel="stylesheet" href="{{ bundle['css']['error'] }}">
{% endblock %}

{% block js %}
    <script src="{{ bundle['js']['error'] }}"></script>
{% endblock %}
````
