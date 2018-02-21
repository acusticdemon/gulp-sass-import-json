const _ = require('lodash');

module.exports = function(json, isScss) {
    const content = _.isString(json) ? JSON.parse(json) : json;

    if(!_.isObject(content)) {
        throw new Error('JSON is not an Object');
    }

    let postfix = isScss ? ';' : '';

    return _.reduce(content, function (sass, value, key) {
        sass += '$' + key + ': ';
        sass += transformValue(value);
        return sass + postfix + '\n';
    }, '');
};

function transformValue(value) {
    let properties;

    if(_.isArray(value)) {
         properties = _.map(value, function (v) {
            return transformValue(v);
        });
        return '(' + properties.join(', ') + ')';
    }

    if(_.isObject(value)) {
        properties = _.map(value, function (v, k) {
            return '' + k + ': ' + transformValue(v);
        });
        return '(' + properties.join(', ') + ')';
    }

    return value;
}
