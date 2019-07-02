"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isMacOs = exports.isMsEdge = exports.isMobile = exports.isAndroid = exports.isIOS = exports.isIpad = void 0;

var isIpad = function isIpad() {
  return navigator.userAgent.includes('iPad');
};

exports.isIpad = isIpad;

var isIOS = function isIOS() {
  return navigator.userAgent.includes('iPhone') || isIpad();
};

exports.isIOS = isIOS;

var isAndroid = function isAndroid() {
  return navigator.userAgent.includes('Android');
};

exports.isAndroid = isAndroid;

var isMobile = function isMobile() {
  return isAndroid() || isIOS();
};

exports.isMobile = isMobile;

var isMsEdge = function isMsEdge() {
  return navigator.userAgent.includes('Edge');
};

exports.isMsEdge = isMsEdge;

var isMacOs = function isMacOs() {
  return navigator.userAgent.includes('Mac');
};

exports.isMacOs = isMacOs;