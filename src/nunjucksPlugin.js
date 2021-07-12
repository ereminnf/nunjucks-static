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
                            bundles: JSON.parse(data.plugin.assetJson),
                        }, this.options.data),
                        filters: this.options.filters,
                    });

                    cb(null, data);
                }
            )
        })
    }
}

module.exports = NunjucksPlugin;