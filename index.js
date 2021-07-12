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
const getFiles = require('./src/getFiles');

module.exports = function(template) {
	this.cacheable();

    const callback = this.async();
	const options = utils.getOptions(this);
	const pathTemplate = options.path;

    getFiles(pathTemplate + '/**').files.map(item => {
        for (const key in item) {
            return item[key];
        }
    }).forEach(item => {
        if (item) {
            this.addDependency(path.normalize(item));
        }
    })

	callback(null, template);
};