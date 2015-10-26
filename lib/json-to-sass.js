var _ = require('lodash');

module.exports = function(json, isScss) {
    var content = _.isString(json) ? JSON.parse(json) : json;

    if(!_.isObject(content)) {
        throw new Error('JSON is not an Object');
    }

    var postfix = isScss ? ';' : '';

    return _.reduce(content, function (sass, value, key) {
        sass += '$' + key + ': ';
        sass += transformValue(value);
        return sass + postfix + '\n';
    }, '');
};

function transformValue(value) {
    var properties;

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
