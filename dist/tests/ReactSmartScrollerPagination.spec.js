"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _enzyme = require("enzyme");

var _styles = require("../lib/styles");

var _ReactSmartScrollerPagination = require("../components/ReactSmartScrollerPagination");

var isMobile = require("../lib/utils/deviceDetect");

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
  pagination: true,
  children: renderImages()
};
describe('ReactSmartScrollerPagination: lib/components', function () {
  afterEach(function () {
    jest.clearAllMocks();
  });
  it('should render itself', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerPagination.ReactSmartScrollerPagination, initialProps));
    expect(wrapper.find(_ReactSmartScrollerPagination.ContainerWrapper).exists()).toEqual(true);
    expect(wrapper.find(_ReactSmartScrollerPagination.Container).exists()).toEqual(true);
    expect(wrapper.find(_ReactSmartScrollerPagination.Pagination).exists()).toEqual(true);
    expect(wrapper.find(_ReactSmartScrollerPagination.LeftArrow).exists()).toEqual(true);
    expect(wrapper.find(_ReactSmartScrollerPagination.RightArrow).exists()).toEqual(true);
    expect(wrapper.find(_ReactSmartScrollerPagination.Dot)).toHaveLength(5);
  });
  it('should return length of children', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerPagination.ReactSmartScrollerPagination, initialProps));
    expect(wrapper.instance().childrenCount).toEqual(5);
  });
  it('should return number of Views', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerPagination.ReactSmartScrollerPagination, initialProps));
    var numViews = 5;
    expect(wrapper.instance().numberOfViews).toEqual(numViews);
  });
  it('should invoke onNext', function () {
    var onNextSpy = jest.spyOn(_ReactSmartScrollerPagination.ReactSmartScrollerPagination.prototype, 'onNext');
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerPagination.ReactSmartScrollerPagination, initialProps));
    wrapper.find(_ReactSmartScrollerPagination.RightArrow).simulate('click');
    expect(onNextSpy).toHaveBeenCalled();
  });
  it('should change slide to first after onNext invoked', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerPagination.ReactSmartScrollerPagination, (0, _extends2.default)({}, initialProps, {
      paginationConfig: {
        infinite: true
      }
    })));

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapper.instance()[refName].current = refContent;
    };

    getRefCurrent('overflowContainerRef', {
      style: {}
    });
    wrapper.setState({
      paginationIndex: 4,
      scrollValue: 400
    });
    wrapper.instance().onNext();
    expect(wrapper.state().paginationIndex).toEqual(0);
    expect(wrapper.state().scrollValue).toEqual(0);
  });
  it('should change slide to next after onNext invoked', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerPagination.ReactSmartScrollerPagination, initialProps));

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapper.instance()[refName].current = refContent;
    };

    var refProps = {
      offsetWidth: 400,
      scrollWidth: 2000
    };
    var scrollValue = 1000;
    var paginationIndex = 1;
    getRefCurrent('overflowContainerRef', (0, _objectSpread2.default)({
      style: {}
    }, refProps));
    wrapper.setState({
      paginationIndex: paginationIndex,
      scrollValue: scrollValue
    });
    wrapper.instance().onNext();
    var newScrollValue = scrollValue - refProps.offsetWidth;
    expect(wrapper.state().paginationIndex).toEqual(2);
    expect(wrapper.state().scrollValue).toEqual(newScrollValue);
  });
  it('should change slide to last after onPrevious invoked', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerPagination.ReactSmartScrollerPagination, (0, _extends2.default)({}, initialProps, {
      paginationConfig: {
        infinite: true
      }
    })));

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapper.instance()[refName].current = refContent;
    };

    getRefCurrent('overflowContainerRef', {
      style: {},
      offsetWidth: 400
    });
    wrapper.setState({
      paginationIndex: 0,
      scrollValue: 400
    });
    wrapper.instance().onPrevious();
    expect(wrapper.state().paginationIndex).toEqual(4);
    expect(wrapper.state().scrollValue).toEqual(-4 * 400);
  });
  it('should change slide to previous after onPrevious invoked', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerPagination.ReactSmartScrollerPagination, (0, _extends2.default)({}, initialProps, {
      paginationConfig: {
        infinite: true
      }
    })));

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapper.instance()[refName].current = refContent;
    };

    var refProps = {
      offsetWidth: 400,
      scrollWidth: 2000
    };
    var scrollValue = 1000;
    var paginationIndex = 1;
    getRefCurrent('overflowContainerRef', (0, _objectSpread2.default)({
      style: {}
    }, refProps));
    wrapper.setState({
      paginationIndex: paginationIndex,
      scrollValue: scrollValue
    });
    wrapper.instance().onPrevious();
    var index = paginationIndex - 1;
    var newScrollValue = scrollValue + refProps.offsetWidth;
    expect(wrapper.state().paginationIndex).toEqual(index);
    expect(wrapper.state().scrollValue).toEqual(newScrollValue);
  });
  it('should not change state when onPrevious invoked and overflowContainerRef doesnt exists', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerPagination.ReactSmartScrollerPagination, initialProps));
    wrapper.instance().onPrevious();
    expect(wrapper.state().paginationIndex).toEqual(0);
    expect(wrapper.state().scrollValue).toEqual(0);
  });
  it('should invoke onDotClick', function () {
    var onDotClickSpy = jest.spyOn(_ReactSmartScrollerPagination.ReactSmartScrollerPagination.prototype, 'onDotClick');
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerPagination.ReactSmartScrollerPagination, initialProps));
    wrapper.find(_ReactSmartScrollerPagination.Dot).at(0).simulate('click');
    expect(onDotClickSpy).toHaveBeenCalled();
    expect(onDotClickSpy).toHaveBeenCalledWith(0);
    expect(wrapper.state().paginationIndex).toEqual(0);
    expect(wrapper.state().scrollValue).toEqual(0);
  });
  it('should invoke onDotClick and change state', function () {
    var onDotClickSpy = jest.spyOn(_ReactSmartScrollerPagination.ReactSmartScrollerPagination.prototype, 'onDotClick');
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerPagination.ReactSmartScrollerPagination, initialProps));

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapper.instance()[refName].current = refContent;
    };

    var refProps = {
      clientWidth: 400
    };
    getRefCurrent('overflowContainerRef', (0, _objectSpread2.default)({
      style: {}
    }, refProps));
    wrapper.find(_ReactSmartScrollerPagination.Dot).at(1).simulate('click');
    expect(onDotClickSpy).toHaveBeenCalled();
    expect(onDotClickSpy).toHaveBeenCalledWith(1);
    expect(wrapper.state().paginationIndex).toEqual(1);
    expect(wrapper.state().scrollValue).toEqual(-refProps.clientWidth);
  });
  it('should invoke onOverflowContentMouseDown', function () {
    var onOverflowContentMouseDownSpy = jest.spyOn(_ReactSmartScrollerPagination.ReactSmartScrollerPagination.prototype, 'onOverflowContentMouseDown');
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerPagination.ReactSmartScrollerPagination, initialProps));
    var event = {
      preventDefault: jest.fn()
    };
    wrapper.find(_ReactSmartScrollerPagination.Container).simulate('mousedown', event);
    expect(onOverflowContentMouseDownSpy).toHaveBeenCalled();
  });
  it('should not invoke onOverflowContentMouseDown if mobile', function () {
    isMobile.isMobile = jest.fn(function () {
      return true;
    });
    var onOverflowContentMouseDownSpy = jest.spyOn(_ReactSmartScrollerPagination.ReactSmartScrollerPagination.prototype, 'onOverflowContentMouseDown');
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerPagination.ReactSmartScrollerPagination, initialProps));
    var event = {
      preventDefault: jest.fn()
    };
    wrapper.find(_ReactSmartScrollerPagination.Container).simulate('mousedown', event);
    expect(onOverflowContentMouseDownSpy).not.toHaveBeenCalled();
  });
  it('should set state after onOverflowContentMouseDown', function () {
    window.addEventListener = jest.fn();
    isMobile.isMobile = jest.fn(function () {
      return false;
    });
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerPagination.ReactSmartScrollerPagination, (0, _extends2.default)({}, initialProps, {
      paginationConfig: {
        draggable: true
      }
    })));

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapper.instance()[refName].current = refContent;
    };

    var refProps = {
      clientWidth: 400
    };
    var event = {
      preventDefault: jest.fn(),
      clientX: 200
    };
    getRefCurrent('overflowContainerRef', (0, _objectSpread2.default)({
      style: {}
    }, refProps));
    wrapper.find(_ReactSmartScrollerPagination.Container).simulate('mousedown', event);
    expect(wrapper.state().deltaX).toEqual(200);
    expect(wrapper.state().scrollLeft).toEqual(0);
    expect(wrapper.state().dragScroll).toEqual(0);
    expect(window.addEventListener).toHaveBeenCalled();
  });
  it('should invoke onOverflowContentDrag and change state', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerPagination.ReactSmartScrollerPagination, (0, _extends2.default)({}, initialProps, {
      paginationConfig: {
        draggable: true
      }
    })));

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapper.instance()[refName].current = refContent;
    };

    var refProps = {
      clientWidth: 400
    };
    var mouseDownEvent = {
      preventDefault: jest.fn(),
      clientX: 0
    };
    var mouseMoveEvent = {
      clientX: 0
    };
    wrapper.find(_ReactSmartScrollerPagination.Container).simulate('mousedown', mouseDownEvent);
    wrapper.instance().onOverflowContentDrag(mouseMoveEvent);
    expect(wrapper.state().dragScroll).toEqual(0);
    getRefCurrent('overflowContainerRef', (0, _objectSpread2.default)({
      style: {}
    }, refProps));
    var secondMouseMoveEvent = {
      clientX: 100
    };
    var dragScroll = secondMouseMoveEvent.clientX - mouseDownEvent.clientX;
    wrapper.instance().onOverflowContentDrag(secondMouseMoveEvent);
    expect(wrapper.state().dragScroll).toEqual(dragScroll);
  });
  it('should invoke deleteOverflowMouseMoveEvent and change slide to next', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerPagination.ReactSmartScrollerPagination, (0, _extends2.default)({}, initialProps, {
      paginationConfig: {
        draggable: true
      }
    })));

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapper.instance()[refName].current = refContent;
    };

    var refProps = {
      clientWidth: 400
    };
    var paginationIndex = 0;
    getRefCurrent('overflowContainerRef', (0, _objectSpread2.default)({
      style: {}
    }, refProps));
    wrapper.setState({
      dragScroll: -200,
      paginationIndex: paginationIndex
    });
    wrapper.instance().deleteOverflowMouseMoveEvent();
    var isLastSlide = false;
    var newValue = isLastSlide ? paginationIndex * refProps.clientWidth : (paginationIndex + 1) * refProps.clientWidth;
    expect(wrapper.state().paginationIndex).toEqual(1);
    expect(wrapper.state().scrollValue).toEqual(-newValue);
    wrapper.setState({
      paginationIndex: 4
    });
    wrapper.instance().deleteOverflowMouseMoveEvent();
    expect(wrapper.state().paginationIndex).toEqual(4);
    expect(wrapper.state().scrollValue).toEqual(-4 * 400);
  });
  it('should invoke deleteOverflowMouseMoveEvent and change slide to previous', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerPagination.ReactSmartScrollerPagination, (0, _extends2.default)({}, initialProps, {
      paginationConfig: {
        draggable: true
      }
    })));

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapper.instance()[refName].current = refContent;
    };

    var refProps = {
      clientWidth: 400
    };
    var paginationIndex = 1;
    getRefCurrent('overflowContainerRef', (0, _objectSpread2.default)({
      style: {}
    }, refProps));
    wrapper.setState({
      dragScroll: 200,
      paginationIndex: paginationIndex
    });
    wrapper.instance().deleteOverflowMouseMoveEvent();
    var isFirstSlide = false;
    var newValue = !isFirstSlide ? (paginationIndex - 1) * refProps.clientWidth : 0;
    expect(wrapper.state().paginationIndex).toEqual(0);
    expect(wrapper.state().scrollValue).toEqual(-newValue);
    wrapper.setState({
      paginationIndex: 0
    });
    wrapper.instance().deleteOverflowMouseMoveEvent();
    expect(wrapper.state().paginationIndex).toEqual(0);
    expect(wrapper.state().scrollValue).toEqual(-newValue);
  });
  it('should render custom pagination', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerPagination.ReactSmartScrollerPagination, (0, _extends2.default)({}, initialProps, {
      renderPagination: function renderPagination() {
        return _react.default.createElement("div", null, _react.default.createElement("div", null, "Left"), _react.default.createElement("div", null, "dot"), _react.default.createElement("div", null, "dot"), _react.default.createElement("div", null, "dot"), _react.default.createElement("div", null, "Right"));
      }
    })));
    expect(wrapper.find(_ReactSmartScrollerPagination.Pagination).exists()).toEqual(false);
  });
  it('should return init transition after deleteOverflowMouseMoveEvent invoked', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerPagination.ReactSmartScrollerPagination, (0, _extends2.default)({}, initialProps, {
      paginationConfig: {
        draggable: true
      }
    })));

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapper.instance()[refName].current = refContent;
    };

    var overflowContainerRef = 'overflowContainerRef';
    getRefCurrent(overflowContainerRef, {
      style: {},
      clientWidth: 200
    });
    wrapper.setState({
      dragScroll: 50,
      scrollLeft: 0
    });
    wrapper.instance().deleteOverflowMouseMoveEvent();
    expect(wrapper.instance()[overflowContainerRef].current.style.transition).toEqual('all 1s');
    expect(wrapper.instance()[overflowContainerRef].current.style.transform).toEqual('translate(-0px)');
  });
  it('should change state after onTouchstart invoked', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerPagination.ReactSmartScrollerPagination, initialProps));
    var touchEvent = {
      touches: {
        length: 1,
        item: jest.fn(function () {
          return {
            clientX: 100,
            clientY: 100
          };
        })
      }
    };

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapper.instance()[refName].current = refContent;
    };

    var overflowContainerRef = 'overflowContainerRef';
    wrapper.instance().onTouchStart(touchEvent);
    expect(wrapper.state().deltaX).toEqual(100);
    expect(wrapper.state().deltaY).toEqual(100);
    expect(wrapper.state().scrollLeft).toEqual(0);
    expect(wrapper.state().dragScroll).toEqual(0);
    expect(wrapper.state().horizontal).toEqual(false);
    expect(wrapper.state().lockedMove).toEqual(false);
    getRefCurrent(overflowContainerRef, {
      style: {
        transition: 'all 1s'
      }
    });
    wrapper.instance().onTouchStart(touchEvent);
    expect(wrapper.instance()[overflowContainerRef].current.style.transition).toEqual('unset');
  });
  it('should return null when onTouchMove invoked', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerPagination.ReactSmartScrollerPagination, (0, _extends2.default)({}, initialProps, {
      paginationConfig: {
        minOffsetToChangeSlide: 50
      }
    })));

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapper.instance()[refName].current = refContent;
    };

    var overflowContainerRef = 'overflowContainerRef';
    var touchEvent = {
      touches: {
        length: 1,
        item: jest.fn(function () {
          return {
            clientX: 0,
            clientY: 100,
            target: {
              addEventListener: jest.fn(),
              dispatchEvent: jest.fn(),
              removeEventListener: jest.fn(),
              parentNode: {
                parentNode: wrapper.instance()[overflowContainerRef].current
              }
            }
          };
        })
      },
      preventDefault: function preventDefault() {}
    };
    getRefCurrent(overflowContainerRef, {
      style: {}
    });
    wrapper.setState({
      horizontal: false,
      lockedMove: true
    });
    expect(wrapper.instance().onTouchMove(touchEvent)).toEqual(null);
    wrapper.setState({
      horizontal: false,
      lockedMove: false,
      deltaY: 20
    });
    wrapper.instance().onTouchMove(touchEvent);
    expect(wrapper.state().horizontal).toEqual(false);
    expect(wrapper.state().lockedMove).toEqual(true);
  });
  it('should change state after onTouchMove invoked with horizontal move', function () {
    var preventDefault = jest.fn();
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerPagination.ReactSmartScrollerPagination, initialProps));

    var getRefCurrent = function getRefCurrent(refName, refContent) {
      return wrapper.instance()[refName].current = refContent;
    };

    var overflowContainerRef = 'overflowContainerRef';
    var touchEvent = {
      touches: {
        length: 1,
        item: jest.fn(function () {
          return {
            clientX: 100,
            clientY: 0,
            target: {
              addEventListener: jest.fn(),
              dispatchEvent: jest.fn(),
              removeEventListener: jest.fn(),
              parentNode: {
                parentNode: wrapper.instance()[overflowContainerRef].current
              }
            }
          };
        })
      },
      preventDefault: preventDefault
    };
    var dragScroll = 80;
    getRefCurrent(overflowContainerRef, {
      style: {}
    });
    wrapper.setState({
      horizontal: false,
      lockedMove: false,
      deltaX: 20
    });
    wrapper.instance().onTouchMove(touchEvent);
    expect(wrapper.state().horizontal).toEqual(true);
    expect(wrapper.state().lockedMove).toEqual(true);
    expect(preventDefault).toHaveBeenCalled();
    expect(wrapper.state().dragScroll).toEqual(dragScroll);
  });
  it('should invoke eventListeners', function () {
    window.removeEventListener = jest.fn();
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerPagination.ReactSmartScrollerPagination, initialProps));
    wrapper.unmount();
    expect(window.removeEventListener).toHaveBeenCalled();
  });
  it('should render children with flexBasis unset', function () {
    var wrapper = (0, _enzyme.shallow)(_react.default.createElement(_ReactSmartScrollerPagination.ReactSmartScrollerPagination, (0, _extends2.default)({}, initialProps, {
      numCols: undefined
    })));
    expect(wrapper.find(_ReactSmartScrollerPagination.ChildrenWrapper).at(0).props().style.flexBasis).toEqual('unset');
  });
});