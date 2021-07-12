const HtmlWebpackPlugin = require('html-webpack-plugin');
const renderToString = require('./renderToString');

class NunjucksPlugin {
    constructor(props) {
        this.options = props.options;
        this.njkOption = props.njkOption;
    }

    apply(compiler) {
        compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
            HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
                'NunjucksPlugin',
                (data, cb) => {
                    data.html = renderToString({
                        template: data.html,
                        path: this.options.templatePath,
                        data: Object.assign({
                            bundles: this.getBundles(JSON.parse(data.plugin.assetJson)),
                        }, this.options.data),
                        filters: this.options.filters,
                    });

                    cb(null, data);
                }
            )
        })
    }

    getBundles(files) {
        let bundles = {
            css: {},
            js: {}
        };

        files.forEach(file => {
            const ext = file.split('/').pop().split('.')[file.split('.').length - 1];
            const name = file.split('/').pop().split('.')[0];

            if (name.length > 1) {
                bundles[ext][name] = file;
            }
        });

        return bundles;
    }
}

module.exports = NunjucksPlugin;