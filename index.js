'use strict';

var fs          = require('fs');
var gutil       = require('gulp-util');
var through     = require('through2');
var path        = require('path');

var jsonToSass  = require('./lib/json-to-sass');

var importJsonRx = /@import\s*['"]?(.*?\.json)['"]?/gi;
var jsonCache = {};

/**
 * @param {Object|null} options
 * @property {Boolean} [options.isScss=false]
 * @returns {*}
 */
module.exports = function (options) {
    return through.obj(function (file, enc, cb) {

        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            cb(new gutil.PluginError('gulp-sass-import-json', 'Streaming not supported'));
            return;
        }

        try {
            var content = file.contents.toString();
            var contentWithImports = content.replace(importJsonRx, function (noop, fileName) {
                var importJsonPath = fileName.indexOf('/') === 0 ? fileName : path.dirname(file.path) + '/' + fileName;

                var compiledJsonContent = jsonCache[importJsonPath];
                if(compiledJsonContent) {
                    return compiledJsonContent;
                }

                var importJsonContent = fs.readFileSync(importJsonPath).toString();

                if(!options) {
                    options = true;
                }

                compiledJsonContent = jsonToSass(importJsonContent, options.isScss || false);

                jsonCache[importJsonPath] = compiledJsonContent;
                return compiledJsonContent;
            });

            file.contents = new Buffer(contentWithImports);

            this.push(file);
        } catch (err) {
            this.emit('error', new gutil.PluginError('gulp-sass-import-json', err));
        }

        cb();
    });
};
