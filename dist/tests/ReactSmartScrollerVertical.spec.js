"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _styles = require("../lib/styles");

var _ReactSmartScrollerVertical = require("../components/ReactSmartScrollerVertical");

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
    width: 20
  },
  children: renderImages()
};
describe('ReactSmartScrollerVertical: lib/components', function () {
  it('should render itself', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerVertical.ReactSmartScrollerVertical, initialProps));
    expect(wrapper.find(_ReactSmartScrollerVertical.Content).exists()).toEqual(true);
    expect(wrapper.find(_ReactSmartScrollerVertical.RectangleThumb).exists()).toEqual(true);
    expect(wrapper.find(_ReactSmartScrollerVertical.Track).exists()).toEqual(true);
  });
  it('should not render Scrollbar', function () {
    Object.defineProperty(window.navigator, agent, mockConfig('iPhone'));
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerVertical.ReactSmartScrollerVertical, initialProps));
    expect(wrapper.find(_ReactSmartScrollerVertical.Track).props().style.display).toEqual('none');
  });
  it('should invoke onOverflowContentScroll onScroll', function () {
    var onOverflowContentScrollSpy = jest.spyOn(_ReactSmartScrollerVertical.ReactSmartScrollerVertical.prototype, 'onOverflowContentScroll');
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerVertical.ReactSmartScrollerVertical, initialProps));
    wrapper.find(_ReactSmartScrollerVertical.Content).simulate('scroll');
    expect(onOverflowContentScrollSpy).toHaveBeenCalled();
  });
  it('should invoke measureContainers onLoad', function () {
    var measureContainersSpy = jest.spyOn(_ReactSmartScrollerVertical.ReactSmartScrollerVertical.prototype, 'measureContainers');
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerVertical.ReactSmartScrollerVertical, initialProps));
    wrapper.find(_ReactSmartScrollerVertical.Content).simulate('load');
    expect(measureContainersSpy).toHaveBeenCalled();
  });
  it('should invoke addEventListener', function () {
    window.addEventListener = jest.fn();
    (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerVertical.ReactSmartScrollerVertical, initialProps));
    expect(window.addEventListener).toHaveBeenCalled();
  });
  it('should invoke removeEventListener', function () {
    window.removeEventListener = jest.fn();
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerVertical.ReactSmartScrollerVertical, initialProps));
    wrapper.unmount();
    expect(window.removeEventListener).toHaveBeenCalled();
  });
  it('should invoke onMouseDown', function () {
    Object.defineProperty(window.navigator, agent, mockConfig('web'));
    var onMouseDownSpy = jest.spyOn(_ReactSmartScrollerVertical.ReactSmartScrollerVertical.prototype, 'onMouseDown');
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerVertical.ReactSmartScrollerVertical, initialProps));
    var event = {
      preventDefault: jest.fn()
    };
    wrapper.find(_ReactSmartScrollerVertical.RectangleThumb).simulate('mousedown', event);
    expect(onMouseDownSpy).toHaveBeenCalled();
  });
  it('should set state after measureContainers invoked', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerVertical.ReactSmartScrollerVertical, (0, _extends2.default)({}, initialProps, {
      numCols: undefined
    })));
    var wrapperInstance = wrapper.instance();

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapperInstance[refName].current = refContent;
    };

    var value = 100;
    var documentHeight = 1000;
    var trackWidth = 50;
    var scrollHeight = 100;
    var overflowRef = 'overflowContainerRef';
    var thumbRef = 'thumbRef';
    var trackRef = 'trackRef';
    getRefCurrent(thumbRef, {
      offsetWidth: value,
      offsetHeight: value
    });
    getRefCurrent(overflowRef, {
      children: [],
      clientHeight: documentHeight,
      scroll: jest.fn(),
      scrollHeight: scrollHeight
    });
    getRefCurrent(trackRef, {
      clientWidth: trackWidth
    });
    wrapperInstance.measureContainers();
    expect(wrapper.state().thumbWidth).toEqual(value);
    expect(wrapper.state().trackWidth).toEqual(trackWidth);
    expect(wrapper.state().scrollContainerHeight).toEqual(documentHeight);
    getRefCurrent(thumbRef, {
      offsetWidth: value,
      offsetHeight: value,
      offsetTop: documentHeight,
      style: {
        top: 0
      }
    });
    wrapperInstance.measureContainers();
    var scrollCircleTopOffset = documentHeight + value;
    var scrollOffset = scrollCircleTopOffset > documentHeight ? documentHeight - value : documentHeight;
    expect(wrapperInstance[overflowRef].current.scroll).toHaveBeenCalled();
    expect(wrapperInstance[overflowRef].current.scroll).toHaveBeenCalledWith(0, scrollHeight);
    expect(wrapperInstance[thumbRef].current.style.top).toEqual("".concat(scrollOffset, "px"));
  });
  it('should change thumbRef after measureContainers invoked', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerVertical.ReactSmartScrollerVertical, (0, _extends2.default)({}, initialProps, {
      numCols: undefined
    })));
    var wrapperInstance = wrapper.instance();

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapperInstance[refName].current = refContent;
    };

    var value = 100;
    var documentHeight = 500;
    var trackWidth = 50;
    var thumbOffsetTop = 800;
    var overflownRef = 'overflowContainerRef';
    var thumbRef = 'thumbRef';
    getRefCurrent('thumbRef', {
      offsetWidth: value,
      offsetHeight: value,
      offsetTop: thumbOffsetTop,
      style: {
        top: 0
      }
    });
    getRefCurrent(overflownRef, {
      children: [],
      clientHeight: documentHeight,
      scroll: jest.fn()
    });
    getRefCurrent('trackRef', {
      clientWidth: trackWidth
    });
    wrapperInstance.measureContainers();
    expect(wrapperInstance[thumbRef].current.style.top).toEqual("".concat(documentHeight - value, "px"));
  });
  it('should change state after onMouseDown', function () {
    var padding = 20;
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerVertical.ReactSmartScrollerVertical, (0, _extends2.default)({}, initialProps, {
      numCols: undefined,
      trackProps: {
        padding: padding
      }
    })));
    var wrapperInstance = wrapper.instance();

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapperInstance[refName].current = refContent;
    };

    var offsetTop = 50;
    var clientY = 100;
    var onMouseDownEvent = {
      clientY: clientY,
      preventDefault: jest.fn()
    };
    getRefCurrent('thumbRef', {
      offsetTop: offsetTop
    });
    getRefCurrent('overflowContainerRef', {
      getBoundingClientRect: jest.fn(function () {
        return {
          top: 0
        };
      })
    });
    wrapper.find(_ReactSmartScrollerVertical.RectangleThumb).simulate('mousedown', onMouseDownEvent);
    expect(wrapper.state().deltaYOrigin).toEqual(offsetTop);
    expect(wrapper.state().deltaY).toEqual(clientY + padding);
    wrapper.setProps({
      trackProps: undefined
    });
    wrapper.find(_ReactSmartScrollerVertical.RectangleThumb).simulate('mousedown', onMouseDownEvent);
    expect(wrapper.state().deltaYOrigin).toEqual(offsetTop);
    expect(wrapper.state().deltaY).toEqual(clientY + padding);
  });
  it('should set thumb left style', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerVertical.ReactSmartScrollerVertical, (0, _extends2.default)({}, initialProps, {
      numCols: undefined
    })));
    var wrapperInstance = wrapper.instance();

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapperInstance[refName].current = refContent;
    };

    var clientY = 100;
    var state = {
      deltaY: 50,
      deltaYOrigin: 0,
      scrollContainerHeight: 500,
      thumbWidth: 100
    };
    var thumbRef = 'thumbRef';
    var onMouseDragEvent = {
      clientY: clientY
    };
    var offset = clientY - state.deltaY + state.deltaYOrigin;
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
      offsetWidth: 100,
      offsetHeight: 100
    });
    wrapperInstance.onMouseDrag(onMouseDragEvent);
    expect(wrapperInstance[thumbRef].current.style.top).toEqual("".concat(offset, "px"));
    wrapperInstance.onMouseDrag({
      clientY: -clientY
    });
    expect(wrapperInstance[thumbRef].current.style.top).toEqual("".concat(0, "px"));
  });
  it('should set thumb critical dimensions after mouseDrag', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerVertical.ReactSmartScrollerVertical, (0, _extends2.default)({}, initialProps, {
      numCols: undefined
    })));
    var wrapperInstance = wrapper.instance();

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapperInstance[refName].current = refContent;
    };

    var clientY = -100;
    var state = {
      deltaY: 50,
      deltaYOrigin: 0,
      scrollContainerHeight: 500,
      thumbWidth: 100
    };
    var thumbRef = 'thumbRef';
    var overflownRef = 'overflowContainerRef';
    var onMouseDragEvent = {
      clientY: clientY
    };
    var offset = clientY - state.deltaY + state.deltaYOrigin;
    var maximumOffset = state.scrollContainerHeight - 100;
    var criticalDimension = offset < 0 ? 0 : maximumOffset;
    var criticalScrollerDimensions = offset > 0 ? 1500 - state.scrollContainerHeight : 0;
    wrapper.setState(state);
    getRefCurrent(overflownRef, {
      scroll: jest.fn(),
      getBoundingClientRect: jest.fn(function () {
        return {
          top: 0
        };
      }),
      scrollHeight: 1500,
      offsetHeight: state.scrollContainerHeight
    });
    getRefCurrent(thumbRef, {
      style: {
        left: 0
      },
      offsetWidth: 100,
      offsetHeight: 100
    });
    wrapperInstance.onMouseDrag(onMouseDragEvent);
    expect(wrapperInstance[thumbRef].current.style.top).toEqual("".concat(criticalDimension, "px"));
    wrapperInstance.onMouseDrag({
      clientY: clientY
    });
    expect(wrapperInstance[thumbRef].current.style.top).toEqual("".concat(0, "px"));
    expect(wrapperInstance[overflownRef].current.scroll).toHaveBeenCalled();
    expect(wrapperInstance[overflownRef].current.scroll).toHaveBeenCalledWith(0, criticalScrollerDimensions);
    wrapperInstance.onMouseDrag({
      clientY: 1000000
    });
    expect(wrapperInstance[thumbRef].current.style.top).toEqual("".concat(maximumOffset, "px"));
    expect(wrapperInstance[overflownRef].current.scroll).toHaveBeenCalled();
    expect(wrapperInstance[overflownRef].current.scroll).toHaveBeenCalledWith(0, criticalScrollerDimensions);
  });
  it('should set thumb left style when overflownScrollContent scrolled', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerVertical.ReactSmartScrollerVertical, (0, _extends2.default)({}, initialProps, {
      numCols: undefined,
      trackProps: undefined
    })));
    var wrapperInstance = wrapper.instance();

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapperInstance[refName].current = refContent;
    };

    var state = {
      scrollContainerHeight: 500
    };
    var thumbHeight = 100;
    var scrollHeight = 1000;
    var clientHeight = 100;
    var scrollTop = 50;
    var thumbRef = 'thumbRef';
    var maximumOffset = state.scrollContainerHeight - thumbHeight;
    var ratio = maximumOffset / (scrollHeight - clientHeight);
    getRefCurrent('overflowContainerRef', {
      scrollHeight: scrollHeight,
      clientHeight: clientHeight,
      scrollTop: scrollTop,
      children: []
    });
    getRefCurrent('thumbRef', {
      style: {
        top: scrollTop
      },
      offsetHeight: thumbHeight
    });
    wrapper.setState(state);
    wrapperInstance.onOverflowContentScroll();
    expect(wrapperInstance[thumbRef].current.style.top).toEqual("".concat(scrollTop * ratio, "px"));
  });
  it('should render custom thumb if provided', function () {
    _react.default.cloneElement = jest.fn();
    (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerVertical.ReactSmartScrollerVertical, (0, _extends2.default)({}, initialProps, {
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
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerVertical.ReactSmartScrollerVertical, null));
    var wrapperInstance = wrapper.instance();
    wrapperInstance.deleteMouseMoveEvent();
    expect(window.removeEventListener).toHaveBeenCalled();
  });
  it('should invoke scroll on overflownRef', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerVertical.ReactSmartScrollerVertical, initialProps));
    var wrapperInstance = wrapper.instance();

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapperInstance[refName].current = refContent;
    };

    var state = {
      deltaY: 50,
      deltaYOrigin: 0,
      scrollContainerHeight: 500
    };
    var thumbRef = 'thumbRef';
    var overflowContainerRef = 'overflowContainerRef';
    var event = {
      clientY: 123
    };
    wrapper.setState(state);
    getRefCurrent(overflowContainerRef, {
      scroll: jest.fn(),
      getBoundingClientRect: jest.fn(function () {
        return {
          top: 0
        };
      })
    });
    getRefCurrent(thumbRef, {
      style: {
        top: 0
      },
      offsetHeight: 100,
      offsetTop: 0
    });
    wrapperInstance.onScrollbarClick(event);
    expect(wrapperInstance[overflowContainerRef].current.scroll).toHaveBeenCalled();
  });
  it('should return null if thumbClicked on onScrollbarClick response', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerVertical.ReactSmartScrollerVertical, initialProps));
    var wrapperInstance = wrapper.instance();

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapperInstance[refName].current = refContent;
    };

    var state = {
      deltaY: 50,
      deltaYOrigin: 0,
      scrollContainerHeight: 500
    };
    var thumbRef = 'thumbRef';
    var overflowContainerRef = 'overflowContainerRef';
    var event = {
      clientY: 0
    };
    wrapper.setState(state);
    getRefCurrent(overflowContainerRef, {
      scroll: jest.fn(),
      getBoundingClientRect: jest.fn(function () {
        return {
          top: 0
        };
      })
    });
    getRefCurrent(thumbRef, {
      style: {
        top: 0
      },
      offsetHeight: 100,
      offsetTop: 0
    });
    wrapperInstance.onScrollbarClick(event);
    expect(wrapperInstance[overflowContainerRef].current.scroll).not.toHaveBeenCalled();
  });
  it('should return not changed scrollContainerWidth', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerVertical.ReactSmartScrollerVertical, (0, _extends2.default)({}, initialProps, {
      trackProps: undefined
    })));
    var wrapperInstance = wrapper.instance();
    var containerHeight = 100;
    var padding = 20;
    expect(wrapperInstance.scrollContainerReducedHeight(containerHeight)).toEqual(containerHeight);
    wrapper.setState({
      padding: {
        top: padding,
        right: padding,
        bottom: padding,
        left: padding
      }
    });
    expect(wrapperInstance.scrollContainerReducedHeight(containerHeight)).toEqual(containerHeight - 2 * padding);
  });
  it('should invoke scroll after content dragged', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerVertical.ReactSmartScrollerVertical, initialProps));
    var wrapperInstance = wrapper.instance();

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapperInstance[refName].current = refContent;
    };

    var state = {
      deltaY: 50
    };
    var overflowContainerRef = 'overflowContainerRef';
    var event = {
      clientY: 123
    };
    wrapper.setState(state);
    getRefCurrent(overflowContainerRef, {
      scroll: jest.fn()
    });
    wrapperInstance.onOverflowContentDrag(event);
    expect(wrapperInstance[overflowContainerRef].current.scroll).toHaveBeenCalled();
  });
  it('should not invoke scroll after content dragged', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerVertical.ReactSmartScrollerVertical, initialProps));
    var wrapperInstance = wrapper.instance();

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapperInstance[refName].current = refContent;
    };

    var state = {
      deltaY: 50
    };
    var overflowContainerRef = 'overflowContainerRef';
    var event = {
      clientY: 0
    };
    wrapper.setState(state);
    getRefCurrent(overflowContainerRef, {
      scroll: jest.fn()
    });
    wrapperInstance.onOverflowContentDrag(event);
    expect(wrapperInstance[overflowContainerRef].current.scroll).not.toHaveBeenCalled();
  });
  it('should invoke event listener and setState after onOverflowContentMouseDown', function () {
    window.addEventListener = jest.fn();
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerVertical.ReactSmartScrollerVertical, (0, _extends2.default)({}, initialProps, {
      draggable: true
    })));
    var wrapperInstance = wrapper.instance();

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapperInstance[refName].current = refContent;
    };

    var overflowContainerRef = 'overflowContainerRef';
    var state = {
      deltaY: 123,
      scrollTop: 0
    };
    var event = {
      clientY: state.deltaY,
      preventDefault: jest.fn()
    };
    getRefCurrent(overflowContainerRef, {
      scrollTop: state.scrollTop,
      children: []
    });
    wrapper.find(_ReactSmartScrollerVertical.Content).simulate('mousedown', event);
    expect(window.addEventListener).toHaveBeenCalled();
    expect(wrapper.state().deltaY).toEqual(state.deltaY);
    expect(wrapper.state().scrollTop).toEqual(state.scrollTop);
  });
  it('should invoke removeEventListener after deleteOverflowMouseMoveEvent', function () {
    window.removeEventListener = jest.fn();
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerVertical.ReactSmartScrollerVertical, initialProps));
    var wrapperInstance = wrapper.instance();
    wrapperInstance.deleteOverflowMouseMoveEvent();
    expect(window.removeEventListener).toHaveBeenCalled();
  });
  it('should not set state after onOverflowContentMouseDown invoked', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerVertical.ReactSmartScrollerVertical, (0, _extends2.default)({}, initialProps, {
      draggable: true
    })));
    var state = {
      deltaY: 0,
      scrollTop: 0
    };
    var event = {
      clientY: state.deltaY,
      preventDefault: jest.fn()
    };
    wrapper.find(_ReactSmartScrollerVertical.Content).simulate('mousedown', event);
    expect(wrapper.state().deltaY).toEqual(state.deltaY);
    expect(wrapper.state().scrollTop).toEqual(state.scrollTop);
  });
  it('should return margin after contentMargin invoked', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerVertical.ReactSmartScrollerVertical, initialProps));
    var wrapperInstance = wrapper.instance();
    var state = {
      thumbWidth: 20,
      trackWidth: 100
    };
    var windowsScrollWidth = 20;
    wrapper.setState(state);
    expect(wrapperInstance.contentMargin).toEqual("".concat(state.trackWidth + 10, "px"));
    wrapper.setState({
      thumbWidth: 200
    });
    expect(wrapperInstance.contentMargin).toEqual("".concat(200 + 10, "px"));
    Object.defineProperty(window.navigator, agent, mockConfig('Mac'));
    expect(wrapperInstance.contentMargin).toEqual("".concat(200 + windowsScrollWidth + 10, "px"));
  });
  it('should invoke onScrollbarClick after CustomScrollbar clicked', function () {
    _ReactSmartScrollerVertical.ReactSmartScrollerVertical.prototype.onScrollbarClick = jest.fn();
    var onScrollbarClickSpy = jest.spyOn(_ReactSmartScrollerVertical.ReactSmartScrollerVertical.prototype, 'onScrollbarClick');
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerVertical.ReactSmartScrollerVertical, initialProps));
    var event = {
      clientY: 123
    };
    wrapper.find(_ReactSmartScrollerVertical.Track).simulate('click', event);
    expect(onScrollbarClickSpy).toHaveBeenCalled();
  });
});