const chai = require('chai');
const expect = chai.expect;

const jsonToSass = require('../lib/json-to-sass');

const color = require('./colors.json');
const sizes = require('./sizes.json');

describe('JSON to sass', function () {
  it('Try transfrom', function () {
    const model = '$colors: (error: #f00, success: #0f0, light: (#fff, #eee, #ccc), dark: (black: #000, smog: #666))\n';
    expect(jsonToSass(color)).to.be.equal(model);
  });
});

describe('JSON to scss', function () {
  it('Try transfrom', function () {
    const model = '$colors: (error: #f00, success: #0f0, light: (#fff, #eee, #ccc), dark: (black: #000, smog: #666));\n';
    expect(jsonToSass(color, true)).to.be.equal(model);
  });

  it('Try transfrom', function () {
    const model = '$colors: (error: #f00, success: #0f0, light: (#fff, #eee, #ccc), dark: (black: #000, smog: #666));\n';
    console.log(jsonToSass(sizes, true))
    expect(jsonToSass(sizes, true)).to.be.equal(model);
  });

});
