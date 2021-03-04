/*
 * Nunjucks-template-laoder
 * Webpack loader for Nunjucks
 * https://github.com/truerk/nunjucks-template-laoder
 *
 * Copyright 2021 Eryomin Nickolay
 * Published under MIT License
 */


const utils = require('loader-utils');
const nunjucks = require('nunjucks');


module.exports = function(template) {
	this.cacheable();

    // loaders
	const callback = this.async();
	const options = utils.getOptions(this);

    // options
	let path = options.path;
    let data = options.data;
    let filters = options.filters;

    const njk = nunjucks.configure(path, {
        autoescape: true,
        noCache: true,
        watch: false
    });

    // filters
    for (const key in filters) {
        njk.addFilter(key, filters[key]);
    }

    const html = njk.renderString(template, data)

	callback(null, html);
};