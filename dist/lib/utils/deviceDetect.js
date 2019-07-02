"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isMobile = exports.isMacOs = exports.isMsEdge = exports.isAndroid = exports.isIOS = exports.isIpad = exports.checkAgent = void 0;

var _server = require("./server");

var checkAgent = function checkAgent(agentName) {
  return !_server.isServer ? navigator.userAgent.includes(agentName) : false;
};

exports.checkAgent = checkAgent;

var isIpad = function isIpad() {
  return checkAgent('iPad');
};

exports.isIpad = isIpad;

var isIOS = function isIOS() {
  return checkAgent('iPhone') || isIpad();
};

exports.isIOS = isIOS;

var isAndroid = function isAndroid() {
  return checkAgent('Android');
};

exports.isAndroid = isAndroid;

var isMsEdge = function isMsEdge() {
  return checkAgent('Edge');
};

exports.isMsEdge = isMsEdge;

var isMacOs = function isMacOs() {
  return checkAgent('Mac');
};

exports.isMacOs = isMacOs;

var isMobile = function isMobile() {
  return isAndroid() || isIOS();
};

exports.isMobile = isMobile;