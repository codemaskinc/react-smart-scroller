"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _styles = require("../lib/styles");

var _ReactSmartScrollerHorizontal = require("../components/ReactSmartScrollerHorizontal");

var mockConfig = function mockConfig(device) {
  return {
    value: device,
    configurable: true
  };
};

var agent = 'userAgent';

var renderImages = function renderImages() {
  var images = ['https://cdn.pixabay.com/photo/2019/06/02/00/46/chapel-4245437__340.jpg', 'https://cdn.pixabay.com/photo/2017/08/22/22/36/cinque-terre-2670762__340.jpg', 'https://cdn.pixabay.com/photo/2016/08/01/20/34/girl-1562091__340.jpg', 'https://cdn.pixabay.com/photo/2013/09/26/23/23/glitter-powder-186829__340.jpg', 'https://cdn.pixabay.com/photo/2019/04/11/09/50/wave-4119274__340.jpg'];
  return images.map(function (image) {
    return _react.default.createElement("img", {
      src: image
    });
  });
};

var initialProps = {
  numCols: 1,
  spacing: 0,
  trackProps: {
    color: _styles.colors.secondary,
    height: 20
  },
  children: renderImages()
};
describe('ReactSmartScrollerHorizontal: lib/components', function () {
  it('should render itself', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal, initialProps));
    expect(wrapper.find(_ReactSmartScrollerHorizontal.SecondWrapper).exists()).toEqual(true);
    expect(wrapper.find(_ReactSmartScrollerHorizontal.RectangleThumb).exists()).toEqual(true);
    expect(wrapper.find(_ReactSmartScrollerHorizontal.Track).exists()).toEqual(true);
  });
  it('should not render Scrollbar', function () {
    Object.defineProperty(window.navigator, agent, mockConfig('iPhone'));
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal, initialProps));
    expect(wrapper.find(_ReactSmartScrollerHorizontal.Track).props().style.display).toEqual('none');
  });
  it('should invoke onOverflowContentScroll onScroll', function () {
    var onOverflowContentScrollSpy = jest.spyOn(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal.prototype, 'onOverflowContentScroll');
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal, initialProps));
    wrapper.find(_ReactSmartScrollerHorizontal.SecondWrapper).simulate('scroll');
    expect(onOverflowContentScrollSpy).toHaveBeenCalled();
  });
  it('should invoke measureContainers onLoad', function () {
    var measureContainersSpy = jest.spyOn(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal.prototype, 'measureContainers');
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal, initialProps));
    wrapper.find(_ReactSmartScrollerHorizontal.SecondWrapper).simulate('load');
    expect(measureContainersSpy).toHaveBeenCalled();
  });
  it('should invoke addEventListener', function () {
    window.addEventListener = jest.fn();
    (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal, initialProps));
    expect(window.addEventListener).toHaveBeenCalled();
  });
  it('should invoke removeEventListener', function () {
    window.removeEventListener = jest.fn();
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal, initialProps));
    wrapper.unmount();
    expect(window.removeEventListener).toHaveBeenCalled();
  });
  it('should invoke onMouseDown', function () {
    Object.defineProperty(window.navigator, agent, mockConfig('web'));
    var onMouseDownSpy = jest.spyOn(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal.prototype, 'onMouseDown');
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal, initialProps));
    var event = {
      preventDefault: jest.fn()
    };
    wrapper.find(_ReactSmartScrollerHorizontal.RectangleThumb).simulate('mousedown', event);
    expect(onMouseDownSpy).toHaveBeenCalled();
  });
  it('should set state after measureContainers invoked', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal, (0, _extends2.default)({}, initialProps, {
      numCols: undefined
    })));
    var wrapperInstance = wrapper.instance();

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapperInstance[refName].current = refContent;
    };

    var value = 100;
    var documentWidth = 1000;
    var trackHeight = 50;
    getRefCurrent('thumbRef', {
      offsetWidth: value,
      offsetHeight: value
    });
    getRefCurrent('overflowContainerRef', {
      children: [],
      clientWidth: documentWidth
    });
    getRefCurrent('trackRef', {
      clientHeight: trackHeight
    });
    wrapperInstance.measureContainers();
    expect(wrapper.state().thumbHeight).toEqual(value);
    expect(wrapper.state().trackHeight).toEqual(trackHeight);
    expect(wrapper.state().scrollContainerWidth).toEqual(documentWidth);
  });
  it('should change thumbRef after measureContainers invoked', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal, (0, _extends2.default)({}, initialProps, {
      numCols: undefined
    })));
    var wrapperInstance = wrapper.instance();

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapperInstance[refName].current = refContent;
    };

    var value = 100;
    var documentWidth = 500;
    var trackHeight = 50;
    var thumbOffsetLeft = 800;
    var overflownRef = 'overflowContainerRef';
    var thumbRef = 'thumbRef';
    getRefCurrent('thumbRef', {
      clientWidth: value,
      clientHeight: value,
      offsetLeft: thumbOffsetLeft,
      style: {
        left: 0
      }
    });
    getRefCurrent(overflownRef, {
      children: [],
      clientWidth: documentWidth,
      scroll: jest.fn()
    });
    getRefCurrent('trackRef', {
      clientHeight: trackHeight
    });
    wrapperInstance.measureContainers();
    expect(wrapperInstance[thumbRef].current.style.left).toEqual("".concat(documentWidth - value, "px"));
  });
  it('should change state after onMouseDown', function () {
    var padding = 20;
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal, (0, _extends2.default)({}, initialProps, {
      numCols: undefined,
      trackProps: {
        padding: padding
      }
    })));
    var wrapperInstance = wrapper.instance();

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapperInstance[refName].current = refContent;
    };

    var offsetLeft = 50;
    var clientX = 100;
    var onMouseDownEvent = {
      clientX: clientX,
      preventDefault: jest.fn()
    };
    getRefCurrent('thumbRef', {
      offsetLeft: offsetLeft
    });
    wrapper.find(_ReactSmartScrollerHorizontal.RectangleThumb).simulate('mousedown', onMouseDownEvent);
    expect(wrapper.state().deltaXOrigin).toEqual(offsetLeft);
    expect(wrapper.state().deltaX).toEqual(clientX + padding);
    wrapper.setProps({
      trackProps: undefined
    });
    wrapper.find(_ReactSmartScrollerHorizontal.RectangleThumb).simulate('mousedown', onMouseDownEvent);
    expect(wrapper.state().deltaXOrigin).toEqual(offsetLeft);
    expect(wrapper.state().deltaX).toEqual(clientX + padding);
  });
  it('should set thumb left style', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal, (0, _extends2.default)({}, initialProps, {
      numCols: undefined
    })));
    var wrapperInstance = wrapper.instance();

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapperInstance[refName].current = refContent;
    };

    var clientX = 100;
    var state = {
      deltaX: 50,
      deltaXOrigin: 0,
      scrollContainerWidth: 500
    };
    var thumbRef = 'thumbRef';
    var onMouseDragEvent = {
      clientX: clientX
    };
    var offset = clientX - state.deltaX + state.deltaXOrigin;
    wrapper.setState(state);
    getRefCurrent('overflowContainerRef', {
      scroll: jest.fn(),
      getBoundingClientRect: jest.fn(function () {
        return {
          left: 0
        };
      })
    });
    getRefCurrent('thumbRef', {
      style: {
        left: 0
      },
      offsetWidth: 100
    });
    wrapperInstance.onMouseDrag(onMouseDragEvent);
    expect(wrapperInstance[thumbRef].current.style.left).toEqual("".concat(offset, "px"));
    wrapperInstance.onMouseDrag({
      clientX: -clientX
    });
    expect(wrapperInstance[thumbRef].current.style.left).toEqual("".concat(0, "px"));
  });
  it('should set thumb left style when overflownScrollContent scrolled', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal, (0, _extends2.default)({}, initialProps, {
      numCols: undefined
    })));
    var wrapperInstance = wrapper.instance();

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapperInstance[refName].current = refContent;
    };

    var state = {
      scrollContainerWidth: 500
    };
    var thumbWidth = 100;
    var scrollWidth = 1000;
    var clientWidth = 100;
    var scrollLeft = 50;
    var thumbRef = 'thumbRef';
    var maximumOffset = state.scrollContainerWidth - thumbWidth;
    var ratio = maximumOffset / (scrollWidth - clientWidth);
    getRefCurrent('overflowContainerRef', {
      scrollWidth: scrollWidth,
      clientWidth: clientWidth,
      scrollLeft: scrollLeft,
      children: []
    });
    getRefCurrent('thumbRef', {
      offsetWidth: thumbWidth,
      style: {
        left: scrollLeft
      }
    });
    wrapper.setState(state);
    wrapperInstance.onOverflowContentScroll();
    expect(wrapperInstance[thumbRef].current.style.left).toEqual("".concat(scrollLeft * ratio, "px"));
  });
  it('should render custom thumb if provided', function () {
    _react.default.cloneElement = jest.fn();
    (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal, (0, _extends2.default)({}, initialProps, {
      numCols: undefined,
      thumb: _react.default.createElement("div", {
        style: {
          width: 20,
          height: 20
        }
      })
    })));
    expect(_react.default.cloneElement).toHaveBeenCalled();
  });
  it('should remove mousemove event', function () {
    window.removeEventListener = jest.fn();
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal, null));
    var wrapperInstance = wrapper.instance();
    wrapperInstance.deleteMouseMoveEvent();
    expect(window.removeEventListener).toHaveBeenCalled();
  });
  it('should invoke scroll on overflownRef', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal, initialProps));
    var wrapperInstance = wrapper.instance();

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapperInstance[refName].current = refContent;
    };

    var state = {
      deltaX: 50,
      deltaXOrigin: 0,
      scrollContainerWidth: 500
    };
    var thumbRef = 'thumbRef';
    var overflowContainerRef = 'overflowContainerRef';
    var event = {
      clientX: 123
    };
    wrapper.setState(state);
    getRefCurrent(overflowContainerRef, {
      scroll: jest.fn(),
      getBoundingClientRect: jest.fn(function () {
        return {
          left: 0
        };
      })
    });
    getRefCurrent(thumbRef, {
      style: {
        left: 0
      },
      clientWidth: 100,
      offsetLeft: 0
    });
    wrapperInstance.onScrollbarClick(event);
    expect(wrapperInstance[overflowContainerRef].current.scroll).toHaveBeenCalled();
  });
  it('should return null if thumbClicked on onScrollbarClick response', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal, initialProps));
    var wrapperInstance = wrapper.instance();

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapperInstance[refName].current = refContent;
    };

    var state = {
      deltaX: 50,
      deltaXOrigin: 0,
      scrollContainerWidth: 500
    };
    var thumbRef = 'thumbRef';
    var overflowContainerRef = 'overflowContainerRef';
    var event = {
      clientX: 0
    };
    wrapper.setState(state);
    getRefCurrent(overflowContainerRef, {
      scroll: jest.fn(),
      getBoundingClientRect: jest.fn(function () {
        return {
          left: 0
        };
      })
    });
    getRefCurrent(thumbRef, {
      style: {
        left: 0
      },
      offsetWidth: 100,
      offsetLeft: 0
    });
    wrapperInstance.onScrollbarClick(event);
    expect(wrapperInstance[overflowContainerRef].current.scroll).not.toHaveBeenCalled();
  });
  it('should return not changed scrollContainerWidth', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal, (0, _extends2.default)({}, initialProps, {
      trackProps: undefined
    })));
    var wrapperInstance = wrapper.instance();
    var containerWidth = 100;
    var padding = 20;
    expect(wrapperInstance.scrollContainerReducedWidth(containerWidth)).toEqual(containerWidth);
    wrapper.setState({
      padding: {
        top: padding,
        right: padding,
        bottom: padding,
        left: padding
      }
    });
    expect(wrapperInstance.scrollContainerReducedWidth(containerWidth)).toEqual(containerWidth - 2 * padding);
  });
  it('should invoke scroll after content dragged', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal, initialProps));
    var wrapperInstance = wrapper.instance();

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapperInstance[refName].current = refContent;
    };

    var state = {
      deltaX: 50
    };
    var overflowContainerRef = 'overflowContainerRef';
    var event = {
      clientX: 123
    };
    wrapper.setState(state);
    getRefCurrent(overflowContainerRef, {
      scroll: jest.fn()
    });
    wrapperInstance.onOverflowContentDrag(event);
    expect(wrapperInstance[overflowContainerRef].current.scroll).toHaveBeenCalled();
  });
  it('should not invoke scroll after component dragged', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal, initialProps));
    var wrapperInstance = wrapper.instance();

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapperInstance[refName].current = refContent;
    };

    var overflowContainerRef = 'overflowContainerRef';
    var event = {
      clientX: 0
    };
    getRefCurrent(overflowContainerRef, {
      scroll: jest.fn()
    });
    wrapperInstance.onOverflowContentDrag(event);
    expect(wrapperInstance[overflowContainerRef].current.scroll).not.toHaveBeenCalled();
  });
  it('should invoke event listener and setState after onOverflowContentMouseDown', function () {
    window.addEventListener = jest.fn();
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal, (0, _extends2.default)({}, initialProps, {
      draggable: true
    })));
    var wrapperInstance = wrapper.instance();

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapperInstance[refName].current = refContent;
    };

    var overflowContainerRef = 'overflowContainerRef';
    var state = {
      deltaX: 123,
      scrollLeft: 0
    };
    var event = {
      clientX: state.deltaX,
      preventDefault: jest.fn()
    };
    getRefCurrent(overflowContainerRef, {
      scrollLeft: state.scrollLeft,
      children: []
    });
    wrapper.find(_ReactSmartScrollerHorizontal.SecondWrapper).simulate('mousedown', event);
    expect(window.addEventListener).toHaveBeenCalled();
    expect(wrapper.state().deltaX).toEqual(state.deltaX);
    expect(wrapper.state().scrollLeft).toEqual(state.scrollLeft);
  });
  it('should not setState after onOverflowContentMouseDown invoked', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal, (0, _extends2.default)({}, initialProps, {
      draggable: true
    })));
    var state = {
      deltaX: 0,
      scrollLeft: 0
    };
    var event = {
      clientX: state.deltaX,
      preventDefault: jest.fn()
    };
    wrapper.find(_ReactSmartScrollerHorizontal.SecondWrapper).simulate('mousedown', event);
    expect(wrapper.state().deltaX).toEqual(state.deltaX);
    expect(wrapper.state().scrollLeft).toEqual(state.scrollLeft);
  });
  it('should invoke removeEventListener after deleteOverflowMouseMoveEvent', function () {
    window.removeEventListener = jest.fn();
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal, initialProps));
    var wrapperInstance = wrapper.instance();
    wrapperInstance.deleteOverflowMouseMoveEvent();
    expect(window.removeEventListener).toHaveBeenCalled();
  });
  it('should set thumb critical dimensions after mouseDrag', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal, (0, _extends2.default)({}, initialProps, {
      numCols: undefined
    })));
    var wrapperInstance = wrapper.instance();

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapperInstance[refName].current = refContent;
    };

    var clientX = -100;
    var state = {
      deltaX: 50,
      deltaXOrigin: 0,
      scrollContainerWidth: 500,
      thumbHeight: 100
    };
    var thumbRef = 'thumbRef';
    var overflownRef = 'overflowContainerRef';
    var onMouseDragEvent = {
      clientX: clientX
    };
    var offset = clientX - state.deltaX + state.deltaXOrigin;
    var maximumOffset = state.scrollContainerWidth - 100;
    var criticalDimension = offset < 0 ? 0 : maximumOffset;
    var criticalScrollerDimensions = offset > 0 ? 1500 - state.scrollContainerWidth : 0;
    wrapper.setState(state);
    getRefCurrent(overflownRef, {
      scroll: jest.fn(),
      getBoundingClientRect: jest.fn(function () {
        return {
          left: 0
        };
      }),
      scrollHeight: 1500,
      offsetWidth: state.scrollContainerWidth
    });
    getRefCurrent(thumbRef, {
      style: {
        left: 0
      },
      offsetWidth: 100,
      offsetHeight: 100
    });
    wrapperInstance.onMouseDrag(onMouseDragEvent);
    expect(wrapperInstance[thumbRef].current.style.left).toEqual("".concat(criticalDimension, "px"));
    wrapperInstance.onMouseDrag({
      clientX: clientX
    });
    expect(wrapperInstance[thumbRef].current.style.left).toEqual("".concat(0, "px"));
    expect(wrapperInstance[overflownRef].current.scroll).toHaveBeenCalled();
    expect(wrapperInstance[overflownRef].current.scroll).toHaveBeenCalledWith(criticalScrollerDimensions, 0);
    wrapperInstance.onMouseDrag({
      clientX: 1000000
    });
    expect(wrapperInstance[thumbRef].current.style.left).toEqual("".concat(maximumOffset, "px"));
    expect(wrapperInstance[overflownRef].current.scroll).toHaveBeenCalled();
    expect(wrapperInstance[overflownRef].current.scroll).toHaveBeenCalledWith(criticalScrollerDimensions, 0);
  });
  it('should return margin after contentMargin invoked', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal, initialProps));
    var wrapperInstance = wrapper.instance();
    var state = {
      thumbHeight: 20,
      trackHeight: 100
    };
    var windowsScrollWidth = 20;
    wrapper.setState(state);
    expect(wrapperInstance.contentMargin).toEqual("".concat(state.trackHeight + 10, "px"));
    wrapper.setState({
      thumbHeight: 200
    });
    expect(wrapperInstance.contentMargin).toEqual("".concat(200 + 10, "px"));
    Object.defineProperty(window.navigator, agent, mockConfig('Mac'));
    expect(wrapperInstance.contentMargin).toEqual("".concat(200 + windowsScrollWidth + 10, "px"));
  });
  it('should invoke onScrollbarClick after CustomScrollbar clicked', function () {
    _ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal.prototype.onScrollbarClick = jest.fn();
    var onScrollbarClickSpy = jest.spyOn(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal.prototype, 'onScrollbarClick');
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal, initialProps));
    var event = {
      clientX: 123
    };
    wrapper.find(_ReactSmartScrollerHorizontal.Track).simulate('click', event);
    expect(onScrollbarClickSpy).toHaveBeenCalled();
  });
});