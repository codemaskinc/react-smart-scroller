"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectSpread3 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _enzyme = require("enzyme");

var _enzymeAdapterReact = _interopRequireDefault(require("enzyme-adapter-react-16"));

var _require = require('jsdom'),
    JSDOM = _require.JSDOM;

var jsdom = new JSDOM('<!doctype html><html><body></body></html>');
var window = jsdom.window;
window.Object = Object;
window.Math = Math;
global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js'
};

function copyProps(src, target) {
  var props = Object.getOwnPropertyNames(src).filter(function (prop) {
    return typeof target[prop] === 'undefined';
  }).reduce(function (result, prop) {
    return (0, _objectSpread3.default)({}, result, (0, _defineProperty2.default)({}, prop, Object.getOwnPropertyDescriptor(src, prop)));
  }, {});
  Object.defineProperties(target, props);
}

var matchMediaPolyfill = function matchMediaPolyfill() {
  return {
    matches: false,
    addListener: function addListener() {},
    removeListener: function removeListener() {}
  };
};

window.matchMedia = window.matchMedia || matchMediaPolyfill;
copyProps(window, global);
(0, _enzyme.configure)({
  adapter: new _enzymeAdapterReact.default()
});