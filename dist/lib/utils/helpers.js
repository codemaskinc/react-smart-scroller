"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPaddingValues = exports.extractNumberFromStyle = exports.noop = exports.all = exports.clearObject = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectSpread3 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _common = require("../common");

// tslint:disable-next-line:no-any
var all = function all() {
  for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
    params[_key] = arguments[_key];
  }

  return params.every(Boolean);
};

exports.all = all;

var clearObject = function clearObject(value) {
  return Object.keys(value).filter(function (key) {
    return Boolean(value[key]);
  }).reduce(function (acc, curr) {
    return (0, _objectSpread3.default)({}, acc, (0, _defineProperty2.default)({}, curr, value[curr]));
  }, {});
};

exports.clearObject = clearObject;

var noop = function noop() {};

exports.noop = noop;

var extractNumberFromStyle = function extractNumberFromStyle(value) {
  return value ? Number(value.toString().replace('px', '')) : undefined;
};

exports.extractNumberFromStyle = extractNumberFromStyle;

var getPaddingValues = function getPaddingValues(padding, paddingLeft, paddingRight, paddingTop, paddingBottom) {
  var zeroPadding = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };

  if (!padding && !paddingLeft && !paddingRight && !paddingTop && !paddingBottom) {
    return zeroPadding;
  }

  if (!padding) {
    return (0, _objectSpread3.default)({}, zeroPadding, {
      right: extractNumberFromStyle(paddingRight),
      left: extractNumberFromStyle(paddingLeft),
      top: extractNumberFromStyle(paddingTop),
      bottom: extractNumberFromStyle(paddingBottom)
    });
  }

  var splittedPadding = padding.toString().split(' ');
  var paddingValuesCount = splittedPadding.length;
  var paddingValues = splittedPadding.map(extractNumberFromStyle);

  switch (paddingValuesCount) {
    case _common.PaddingCount.One:
      {
        var _paddingValues = (0, _slicedToArray2.default)(paddingValues, 1),
            _padding = _paddingValues[0];

        return {
          top: _padding,
          right: _padding,
          bottom: _padding,
          left: _padding
        };
      }

    case _common.PaddingCount.Two:
      {
        var _paddingValues2 = (0, _slicedToArray2.default)(paddingValues, 2),
            paddingVertical = _paddingValues2[0],
            paddingHorizontal = _paddingValues2[1];

        return {
          top: paddingVertical,
          right: paddingHorizontal,
          bottom: paddingVertical,
          left: paddingHorizontal
        };
      }

    case _common.PaddingCount.Three:
      {
        var _paddingValues3 = (0, _slicedToArray2.default)(paddingValues, 3),
            _paddingTop = _paddingValues3[0],
            _paddingHorizontal = _paddingValues3[1],
            _paddingBottom = _paddingValues3[2];

        return {
          top: _paddingTop,
          right: _paddingHorizontal,
          bottom: _paddingBottom,
          left: _paddingHorizontal
        };
      }

    case _common.PaddingCount.Four:
    default:
      {
        var _paddingValues4 = (0, _slicedToArray2.default)(paddingValues, 4),
            top = _paddingValues4[0],
            right = _paddingValues4[1],
            bottom = _paddingValues4[2],
            left = _paddingValues4[3];

        return {
          top: top,
          right: right,
          bottom: bottom,
          left: left
        };
      }
  }
};

exports.getPaddingValues = getPaddingValues;