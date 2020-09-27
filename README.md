[npm-url]: https://www.npmjs.com/package/nunjucks-template-loader
[npm-image]: https://img.shields.io/npm/v/nunjucks-template-loader?color=blue

[logo-url]: https://github.com/truerk/nunjucks-template-loader
[logo-image]: https://i.ibb.co/ZLJQnqP/nunjucks-template-loader.webp

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://github.com/truerk/nunjucks-template-loader/blob/master/LICENSE

[size-image]: https://img.shields.io/npm/dm/nunjucks-template-loader.svg
[size-url]: https://www.npmjs.com/package/nunjucks-template-loader

# Nunjucks loader [![NPM version][npm-image]][npm-url] [![GitHub license][license-image]][license-url] [![NPM size][size-image]][size-url]

[![][logo-image]][logo-url]

Webpack loader for nunjucks

## Installation and usage

### npm
```js
npm i nunjucks-template-loader --save-dev
```

### webpack
Generating folders for the nunjucks view
```js
function returnEntries(globPath){
    let entries = glob_entries(globPath, true);
    let folderList = new Array();
    for (let folder in entries){
       folderList.push(entries[folder]);
    }
    return folderList;
}
```
```js
{
    test: /\.html$|njk|nunjucks/,
    exclude: [/(node_modules)/, /(src)/],
    use: [
        'html-loader',
        {
            loader: 'nunjucks-template-loader',
            options: {
                paths: [...returnEntries(path.resolve(__dirname, './templates/**/'))],
            }
        }
    ]
}
```

### options data

```js
options: {
	...
	data: {
		foo: 'indexBar'
	}
}
```

### options filters

```js
function shorten(value, count) {
    return value.slice(0, count || 5);
}

options: {
	...
	filters: {
		shorten
	}
}
```