const _ = require('lodash');

const transformValue = value => {
    let properties;

    if (value === '%') {
        console.warn(
            "gulp-sass-import-json: the JSON contains an entry with the value '%'. This cannot be compiled into SCSS, and has been removed."
        );
        return null;
    }

    if (_.isArray(value)) {
        properties = _.map(value, function (v) {
            return transformValue(v);
        });
        return '(' + properties.join(', ') + ')';
    }

    if (_.isObject(value)) {
        properties = _.map(value, function (v, k) {
            return '' + k + ': ' + transformValue(v);
        });
        return '(' + properties.join(', ') + ')';
    }

    return value;
};

module.exports = function (json, isScss) {
    const content = _.isString(json) ? JSON.parse(json) : json;

    if (!_.isObject(content)) {
        throw new Error('JSON is not an Object');
    }

    let postfix = isScss ? ';' : '';

    return _.reduce(
        content,
        function (sass, value, key) {
            if (key.indexOf('$') < 0) {
                sass += '$' + key + ': ';
                sass += transformValue(value);
                return sass + postfix + '\n';
            } else {
                console.warn(
                    `gulp-sass-import-json: the JSON entry with the key '${key}' cannot be converted to SCSS and has been ignored.`
                );
                return '';
            }
        },
        ''
    );
};
