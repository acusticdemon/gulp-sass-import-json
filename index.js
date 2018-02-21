'use strict';

const fs          = require('fs');
const gutil       = require('gulp-util');
const through     = require('through2');
const path        = require('path');

const jsonToSass  = require('./lib/json-to-sass');

const importJsonRx = /@import\s*['"]?(.*?\.json)['"]?/gi;
const jsonCache = {};

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
            let content = file.contents.toString();
            let contentWithImports = content.replace(importJsonRx, function (noop, fileName) {
                let importJsonPath = fileName.indexOf('/') === 0 ? fileName : path.dirname(file.path) + '/' + fileName;

                let compiledJsonContent = jsonCache[importJsonPath];
                if(compiledJsonContent) {
                    return compiledJsonContent;
                }

                let importJsonContent = fs.readFileSync(importJsonPath).toString();

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
