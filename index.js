/*
 * Nunjucks-template-laoder
 * Webpack loader for Nunjucks
 * https://github.com/truerk/nunjucks-template-laoder
 *
 * Copyright 2021 Eryomin Nickolay
 * Published under MIT License
 */


const utils = require('loader-utils');
const path = require('path');
const nunjucks = require('nunjucks');
const generateGlobPath = require('./utils/generateGlobPath');


module.exports = function(template) {
	this.cacheable();

    // loaders
	const callback = this.async();
	const options = utils.getOptions(this);

    // options
	let pathTemplate = options.path;
    let data = options.data;
    let filters = options.filters;

    generateGlobPath(pathTemplate + '/**').files.map(item => {
        for (const key in item) {
            if (key !== 'index.njk') {
                return item[key];
            }
        }
    }).forEach(item => {
        if (item) {
            this.addDependency(path.normalize(item));
        }
    })

    const njk = nunjucks.configure(pathTemplate, {
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