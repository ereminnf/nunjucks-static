const nunjucks = require('nunjucks');

module.exports = function({
    template,
    path,
    data,
    filters
}, options) {
    const njk = nunjucks.configure(path, Object.assign({
        autoescape: true,
        noCache: true,
        watch: false
    }, options));

    for (const key in filters) {
        njk.addFilter(key, filters[key]);
    }

    const html = njk.renderString(template, data);

	return html;
};