"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _colors = require("./colors");

Object.keys(_colors).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _colors[key];
    }
  });
});