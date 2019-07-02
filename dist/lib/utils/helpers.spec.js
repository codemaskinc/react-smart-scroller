"use strict";

var _helpers = require("./helpers");

describe('utils: clearObject', function () {
  it('should return object without undefined fields', function () {
    var inputObject = {
      a: 'a',
      b: undefined,
      c: 3
    };
    var expectedObject = {
      a: 'a',
      c: 3
    };
    var undefinedObject = {
      a: undefined
    };
    expect((0, _helpers.clearObject)(inputObject)).toEqual(expectedObject);
    expect((0, _helpers.clearObject)(undefinedObject)).toEqual({});
  });
});
describe('utils: getPaddingValues', function () {
  it('should return null', function () {
    var outputValues = {
      bottom: 0,
      left: 0,
      right: 0,
      top: 0
    };
    expect((0, _helpers.getPaddingValues)()).toEqual(outputValues);
  });
  it('should return object with paddings', function () {
    var padding = undefined;
    var left = 10;
    var right = 10;
    var top = 10;
    var bottom = 10;
    var outputValues = {
      bottom: bottom,
      left: left,
      right: right,
      top: top
    };
    expect((0, _helpers.getPaddingValues)(padding, left, right, top, bottom)).toEqual(outputValues);
  });
  it('should return object when padding with 1 props', function () {
    var padding = 10;
    var outputValues = {
      bottom: padding,
      left: padding,
      right: padding,
      top: padding
    };
    expect((0, _helpers.getPaddingValues)(padding)).toEqual(outputValues);
  });
  it('should return object when padding with 2 props', function () {
    var verticalPadding = 10;
    var horizontalPadding = 5;
    var padding = "".concat(verticalPadding, "px ").concat(horizontalPadding, "px");
    var outputValues = {
      bottom: verticalPadding,
      left: horizontalPadding,
      right: horizontalPadding,
      top: verticalPadding
    };
    expect((0, _helpers.getPaddingValues)(padding)).toEqual(outputValues);
  });
  it('should return object when padding with 3 props', function () {
    var top = 10;
    var bottom = 15;
    var horizontalPadding = 5;
    var padding = "".concat(top, "px ").concat(horizontalPadding, "px ").concat(bottom, "px");
    var outputValues = {
      bottom: bottom,
      left: horizontalPadding,
      right: horizontalPadding,
      top: top
    };
    expect((0, _helpers.getPaddingValues)(padding)).toEqual(outputValues);
  });
  it('should return object when padding with 4 props', function () {
    var top = 10;
    var bottom = 15;
    var left = 20;
    var right = 25;
    var padding = "".concat(top, "px ").concat(right, "px ").concat(bottom, "px ").concat(left, "px");
    var outputValues = {
      bottom: bottom,
      left: left,
      right: right,
      top: top
    };
    expect((0, _helpers.getPaddingValues)(padding)).toEqual(outputValues);
  });
});
describe('utils: extractNumberFromStyle', function () {
  it('should return Number when string with px given', function () {
    var digit = 10;
    var styleNumber = "".concat(digit, "px");
    expect((0, _helpers.extractNumberFromStyle)(styleNumber)).toEqual(digit);
  });
  it('should return Number when number given', function () {
    var digit = 10;
    expect((0, _helpers.extractNumberFromStyle)(digit)).toEqual(digit);
  });
  it('should return undefined when nothing provided', function () {
    expect((0, _helpers.extractNumberFromStyle)()).toEqual(undefined);
  });
});