var chai   = require('chai');
var expect = chai.expect;

var jsonToSass = require('../lib/json-to-sass');

describe('JSON to sass', function() {
    it('Try transfrom', function () {
        var insert = require('./colors.json');
        var model = "$colors: (error: #f00, success: #0f0, light: (#fff, #eee, #ccc), dark: (black: #000, smog: #666))\n";
        expect(jsonToSass(insert)).to.be.equal(model);
    });
});
