'use strict';

var fs = require('fs');
var gutil = require('gulp-util');
var through = require('through2');
var _ = require('lodash');

var jsonCash = {};

module.exports = function (options) {
    var postfix = options && options.isScss ? ';' : '';
    return through.obj(function (file, enc, cb) {

        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            cb(new gutil.PluginError('gulp-json-to-sass', 'Streaming not supported'));
            return;
        }

        try {
            var content = file.contents.toString();
            var jsonImports = content.replace(/@import\s*['"]?(.*?\.json)['"]?/gi, function (noop, fileName) {
                var extendPath = file.base + fileName;
                var cashed = jsonCash[extendPath];
                if(cashed) {
                    return cashed;
                }

                var extendContent = JSON.parse(fs.readFileSync(extendPath).toString());

                extendContent = _.reduce(extendContent, function (sass, value, key) {
                    sass += '$' + key + ': ';
                    if (_.isObject(value)) {
                        var map = _.map(value, function (v, k) {
                            v = _.isObject(v) || _.isArray(v) ? null : v;
                            return '' + k + ': ' + v;
                        }).join(', ');
                        sass += '(' + map + ')';
                    } else {
                        sass += value;
                    }
                    return sass + postfix + '\n';
                }, '');

                jsonCash[extendPath] = extendContent;
                return extendContent;
            });
            file.contents = new Buffer(jsonImports);

            this.push(file);
        } catch (err) {
            this.emit('error', new gutil.PluginError('gulp-temp', err));
        }

        cb();
    });
};
