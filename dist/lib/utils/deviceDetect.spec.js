"use strict";

var _deviceDetect = require("./deviceDetect");

var serverUtils = require("./server");

var mockConfig = function mockConfig(device) {
  return {
    value: device,
    configurable: true
  };
};

var agent = 'userAgent';
describe('utils: deviceDetect', function () {
  it('should return corresponding values for Android device', function () {
    Object.defineProperty(window.navigator, agent, mockConfig('Android'));
    expect((0, _deviceDetect.isIOS)()).toEqual(false);
    expect((0, _deviceDetect.isAndroid)()).toEqual(true);
    expect((0, _deviceDetect.isMobile)()).toEqual(true);
  });
  it('should return corresponding values for iOS device', function () {
    Object.defineProperty(window.navigator, agent, mockConfig('iPhone'));
    expect((0, _deviceDetect.isIOS)()).toEqual(true);
    expect((0, _deviceDetect.isAndroid)()).toEqual(false);
    expect((0, _deviceDetect.isMobile)()).toEqual(true);
  });
  it('should return corresponding values for iPad', function () {
    Object.defineProperty(window.navigator, agent, mockConfig('iPad'));
    expect((0, _deviceDetect.isIOS)()).toEqual(true);
    expect((0, _deviceDetect.isAndroid)()).toEqual(false);
    expect((0, _deviceDetect.isMobile)()).toEqual(true);
  });
  it('should return false for unmated platforms', function () {
    Object.defineProperty(window.navigator, agent, {
      value: ''
    });
    expect((0, _deviceDetect.isIOS)()).toEqual(false);
    expect((0, _deviceDetect.isAndroid)()).toEqual(false);
    expect((0, _deviceDetect.isMobile)()).toEqual(false);
  });
  it('should return true for Edge browser', function () {
    Object.defineProperty(window.navigator, agent, mockConfig('Edge'));
    expect((0, _deviceDetect.isMsEdge)()).toEqual(true);
  });
  it('should return false if window is undefined', function () {
    serverUtils.isServer = true;
    expect((0, _deviceDetect.checkAgent)('Edge')).toEqual(false);
  });
});