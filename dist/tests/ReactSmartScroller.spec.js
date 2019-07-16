"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _ReactSmartScroller = require("../components/ReactSmartScroller");

var _ReactSmartScrollerPagination = require("../components/ReactSmartScrollerPagination");

var _ReactSmartScrollerHorizontal = require("../components/ReactSmartScrollerHorizontal");

var _ReactSmartScrollerVertical = require("../components/ReactSmartScrollerVertical");

var server = require("../lib/utils/server");

describe('ReactSmartScroller: lib/components', function () {
  it('should not render', function () {
    server.isServer = true;
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScroller.ReactSmartScroller, null));
    expect(wrapper.find(_ReactSmartScroller.Wrapper).exists()).toEqual(false);
    expect(wrapper.find(_ReactSmartScrollerVertical.ReactSmartScrollerVertical).exists()).toEqual(false);
    expect(wrapper.find(_ReactSmartScrollerPagination.ReactSmartScrollerPagination).exists()).toEqual(false);
    expect(wrapper.find(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal).exists()).toEqual(false);
  });
  it('should render ReactSmartScrollerPagination', function () {
    server.isServer = false;
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScroller.ReactSmartScroller, {
      pagination: true
    }));
    expect(wrapper.find(_ReactSmartScroller.Wrapper).exists()).toEqual(true);
    expect(wrapper.find(_ReactSmartScrollerPagination.ReactSmartScrollerPagination).exists()).toEqual(true);
  });
  it('should render ReactSmartScrollerHorizontal', function () {
    server.isServer = false;
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScroller.ReactSmartScroller, null));
    expect(wrapper.find(_ReactSmartScroller.Wrapper).exists()).toEqual(true);
    expect(wrapper.find(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal).exists()).toEqual(true);
  });
  it('should render ReactSmartScrollerVertical', function () {
    server.isServer = false;
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScroller.ReactSmartScroller, {
      vertical: true
    }));
    expect(wrapper.find(_ReactSmartScroller.Wrapper).exists()).toEqual(true);
    expect(wrapper.find(_ReactSmartScrollerVertical.ReactSmartScrollerVertical).exists()).toEqual(true);
  });
});