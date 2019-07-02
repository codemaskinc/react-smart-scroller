"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EmptyAbsolute = exports.RectangleThumb = exports.Track = exports.ChildrenWrapper = exports.Content = exports.ReactSmartScrollerVertical = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _utils = require("../lib/utils");

var _styles = require("../lib/styles");

function _templateObject5() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n    position: absolute;\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n    position: relative;\n    background-color: ", ";\n    cursor: pointer;\n    width: 10px;\n    height: 100%;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n    position: absolute;\n    cursor: pointer;\n    right: 0;\n    height: 100%;\n    background-color: ", ";\n    top: 0;\n    width: 10px;\n    display: flex;\n    justify-content: center;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n    box-sizing: border-box;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n    height: 100%;\n    display: flex;\n    flex-direction: column;\n    overflow-x: hidden;\n    overflow-y: scroll;\n    margin-right: -20px;\n    -webkit-overflow-scrolling: touch;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var ReactSmartScrollerVertical =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(ReactSmartScrollerVertical, _React$Component);

  function ReactSmartScrollerVertical(props) {
    var _this;

    (0, _classCallCheck2.default)(this, ReactSmartScrollerVertical);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ReactSmartScrollerVertical).call(this, props));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      scrollContainerHeight: 0,
      deltaYOrigin: 0,
      deltaY: 0,
      thumbWidth: 0,
      trackWidth: 0,
      scrollHeight: 0,
      scrollTop: 0,
      padding: _this.trackPadding
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "overflowContainerRef", _react.default.createRef());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "thumbRef", _react.default.createRef());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "trackRef", _react.default.createRef());
    _this.measureContainers = _this.measureContainers.bind((0, _assertThisInitialized2.default)(_this));
    _this.onMouseDown = _this.onMouseDown.bind((0, _assertThisInitialized2.default)(_this));
    _this.onMouseDrag = _this.onMouseDrag.bind((0, _assertThisInitialized2.default)(_this));
    _this.onOverflowContentScroll = _this.onOverflowContentScroll.bind((0, _assertThisInitialized2.default)(_this));
    _this.deleteMouseMoveEvent = _this.deleteMouseMoveEvent.bind((0, _assertThisInitialized2.default)(_this));
    _this.onScrollbarClick = _this.onScrollbarClick.bind((0, _assertThisInitialized2.default)(_this));
    _this.onOverflowContentMouseDown = _this.onOverflowContentMouseDown.bind((0, _assertThisInitialized2.default)(_this));
    _this.onOverflowContentDrag = _this.onOverflowContentDrag.bind((0, _assertThisInitialized2.default)(_this));
    _this.deleteOverflowMouseMoveEvent = _this.deleteOverflowMouseMoveEvent.bind((0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  (0, _createClass2.default)(ReactSmartScrollerVertical, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      window.addEventListener('resize', this.measureContainers);
      window.addEventListener('mouseup', this.deleteMouseMoveEvent);
      window.addEventListener('mouseup', this.deleteOverflowMouseMoveEvent);
      this.measureContainers();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this.measureContainers);
      window.removeEventListener('mouseup', this.deleteMouseMoveEvent);
      window.removeEventListener('mouseup', this.deleteOverflowMouseMoveEvent);
    }
  }, {
    key: "scrollContainerReducedHeight",
    value: function scrollContainerReducedHeight(scrollContainerHeight) {
      var padding = this.state.padding;
      return scrollContainerHeight - (padding.top + padding.bottom);
    }
  }, {
    key: "measureContainers",
    value: function measureContainers() {
      var overflownRef = this.overflowContainerRef.current;
      var thumbRef = this.thumbRef.current;
      var trackRef = this.trackRef.current;

      var areRefsCurrent = _utils.C.all(overflownRef, thumbRef, trackRef);

      if (areRefsCurrent) {
        this.setState({
          scrollContainerHeight: this.scrollContainerReducedHeight(overflownRef.clientHeight),
          thumbWidth: thumbRef.offsetWidth,
          trackWidth: trackRef.clientWidth,
          scrollHeight: overflownRef.scrollHeight
        });
      }

      if (areRefsCurrent && thumbRef.offsetTop + thumbRef.offsetHeight > overflownRef.clientHeight) {
        var scrollOffset = overflownRef.clientHeight - thumbRef.offsetHeight;
        overflownRef.scroll(0, overflownRef.scrollHeight);
        thumbRef.style.top = "".concat(scrollOffset, "px");
      }
    }
  }, {
    key: "onMouseDown",
    value: function onMouseDown(event) {
      event.preventDefault();
      var thumbRef = this.thumbRef.current;
      var overflownRef = this.overflowContainerRef.current;

      if (thumbRef && overflownRef) {
        this.setState({
          deltaYOrigin: thumbRef.offsetTop,
          deltaY: event.clientY + this.state.padding.top
        });
      }

      window.addEventListener('mousemove', this.onMouseDrag);
    }
  }, {
    key: "onScrollbarClick",
    value: function onScrollbarClick(_ref) {
      var clientY = _ref.clientY;
      var padding = this.state.padding;
      var thumbRef = this.thumbRef.current;
      var overflowRef = this.overflowContainerRef.current;

      var shouldReturn = _utils.C.all(thumbRef, overflowRef, clientY >= (_utils.C.extractNumberFromStyle(thumbRef.style.top) || 0) + overflowRef.getBoundingClientRect().top + padding.top, clientY <= (_utils.C.extractNumberFromStyle(thumbRef.style.top) || 0) + overflowRef.getBoundingClientRect().top + thumbRef.offsetHeight + padding.top); // leave this function if thumb was clicked


      if (shouldReturn) {
        return null;
      }

      var maximumOffset = this.state.scrollContainerHeight - thumbRef.offsetHeight;
      var ratio = (overflowRef.scrollHeight - overflowRef.clientHeight) / maximumOffset;
      var deltaY = overflowRef.getBoundingClientRect().top + thumbRef.offsetHeight / 2 + padding.top;
      return overflowRef.scroll({
        top: ratio * (clientY - deltaY),
        left: 0,
        behavior: 'smooth'
      });
    }
  }, {
    key: "deleteMouseMoveEvent",
    value: function deleteMouseMoveEvent() {
      window.removeEventListener('mousemove', this.onMouseDrag);
    }
  }, {
    key: "deleteOverflowMouseMoveEvent",
    value: function deleteOverflowMouseMoveEvent() {
      window.removeEventListener('mousemove', this.onOverflowContentDrag);
    }
  }, {
    key: "onMouseDrag",
    value: function onMouseDrag(event) {
      var zero = 0;
      var _this$state = this.state,
          deltaY = _this$state.deltaY,
          deltaYOrigin = _this$state.deltaYOrigin,
          scrollContainerHeight = _this$state.scrollContainerHeight,
          padding = _this$state.padding;
      var overflowRef = this.overflowContainerRef.current;
      var thumbRef = this.thumbRef.current;
      var maximumOffset = scrollContainerHeight - thumbRef.offsetHeight;
      var offset = event.clientY - deltaY + deltaYOrigin + padding.top;
      var isBetweenClientHeight = offset >= zero && offset <= maximumOffset;

      var areRefsCurrent = _utils.C.all(Boolean(this.overflowContainerRef.current), Boolean(this.thumbRef.current));

      if (areRefsCurrent && !isBetweenClientHeight) {
        var criticalDimension = offset < zero ? zero : maximumOffset;
        var criticalScrollerDimensions = offset > zero ? overflowRef.scrollHeight - overflowRef.offsetHeight : zero;
        thumbRef.style.top = "".concat(criticalDimension, "px");
        overflowRef.scroll(zero, criticalScrollerDimensions);
      }

      if (areRefsCurrent && isBetweenClientHeight) {
        var ratio = (overflowRef.scrollHeight - overflowRef.offsetHeight) / maximumOffset;
        overflowRef.scroll(zero, ratio * offset);
        thumbRef.style.top = "".concat(offset, "px");
      }
    }
  }, {
    key: "onOverflowContentScroll",
    value: function onOverflowContentScroll() {
      var scrollContainerHeight = this.state.scrollContainerHeight;
      var thumbRef = this.thumbRef.current;
      var overflowRef = this.overflowContainerRef.current;

      if (overflowRef && thumbRef) {
        var maximumOffset = scrollContainerHeight - thumbRef.offsetHeight;
        var ratio = maximumOffset / (overflowRef.scrollHeight - overflowRef.clientHeight);
        thumbRef.style.top = "".concat(overflowRef.scrollTop * ratio, "px");
      }
    }
  }, {
    key: "onOverflowContentMouseDown",
    value: function onOverflowContentMouseDown(event) {
      event.preventDefault();
      var overflowRef = this.overflowContainerRef.current;

      if (overflowRef) {
        this.setState({
          deltaY: event.clientY,
          scrollTop: overflowRef.scrollTop
        });
      }

      window.addEventListener('mousemove', this.onOverflowContentDrag);
    }
  }, {
    key: "onOverflowContentDrag",
    value: function onOverflowContentDrag(event) {
      var _this$state2 = this.state,
          deltaY = _this$state2.deltaY,
          scrollTop = _this$state2.scrollTop;
      var overflowRef = this.overflowContainerRef.current;

      if (overflowRef && event.clientY !== 0) {
        overflowRef.scroll(0, scrollTop - (event.clientY - deltaY));
      }
    }
  }, {
    key: "renderThumb",
    value: function renderThumb() {
      var _this$state3 = this.state,
          scrollContainerHeight = _this$state3.scrollContainerHeight,
          scrollHeight = _this$state3.scrollHeight;
      var percentageWidth = Number((scrollContainerHeight * 100 / scrollHeight).toFixed(0));
      var height = "".concat(percentageWidth * scrollContainerHeight / 100, "px");

      if (this.props.thumb) {
        return _react.default.cloneElement(this.props.thumb, {
          ref: this.thumbRef,
          onMouseDown: this.onMouseDown,
          style: (0, _objectSpread2.default)({
            top: 0,
            position: 'relative',
            cursor: 'pointer'
          }, this.props.thumb.props.style)
        });
      }

      return _react.default.createElement(RectangleThumb, {
        ref: this.thumbRef,
        onMouseDown: this.onMouseDown,
        style: {
          height: height
        }
      });
    }
  }, {
    key: "renderScrollbar",
    value: function renderScrollbar() {
      var display = !(0, _utils.isMobile)() && this.shouldRenderScrollbar;
      return _react.default.createElement(Track, {
        ref: this.trackRef,
        onClick: this.onScrollbarClick,
        style: (0, _objectSpread2.default)({
          color: _styles.colors.gray.mediumGray,
          right: this.rightOffset,
          display: display ? 'flex' : 'none'
        }, this.props.trackProps)
      }, _react.default.createElement(EmptyAbsolute, null, this.renderThumb()));
    }
  }, {
    key: "renderChildren",
    value: function renderChildren() {
      var _this2 = this;

      var cols = this.props.numCols;
      var spacing = this.props.spacing;
      var padding = spacing / 2;
      var children = this.props.children;
      return _react.default.Children.map(children, function (child, index) {
        var paddingBottom = index !== _react.default.Children.count(children) - 1 ? "paddingBottom: ".concat(padding, "px") : undefined;
        var paddingTop = index !== 0 ? "paddingTop: ".concat(padding, "px") : undefined;
        var height = cols ? "calc(100% / ".concat(cols, ")") : 'auto';

        var extendedChild = _react.default.cloneElement(children[index], {
          style: (0, _objectSpread2.default)({
            display: 'flex'
          }, children[index].props.style)
        });

        return _react.default.createElement(ChildrenWrapper, {
          style: {
            padding: "".concat(padding, "px 0"),
            height: height,
            paddingTop: paddingTop,
            paddingBottom: paddingBottom,
            marginRight: _this2.contentMargin
          }
        }, extendedChild);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var draggable = this.props.draggable;
      var cursor = draggable ? 'pointer' : 'unset';
      return _react.default.createElement(_react.Fragment, null, _react.default.createElement(Content, {
        ref: this.overflowContainerRef,
        onScroll: this.onOverflowContentScroll,
        onLoad: this.measureContainers,
        onMouseDown: draggable ? this.onOverflowContentMouseDown : _utils.C.noop,
        style: {
          cursor: cursor
        }
      }, this.renderChildren()), this.renderScrollbar());
    }
  }, {
    key: "shouldRenderScrollbar",
    get: function get() {
      var overflownRef = this.overflowContainerRef.current;
      var cols = this.props.numCols;

      if (!cols && overflownRef) {
        return overflownRef.clientHeight < overflownRef.scrollHeight;
      }

      return !(overflownRef && overflownRef.children.length <= cols);
    }
  }, {
    key: "trackPadding",
    get: function get() {
      var trackProps = this.props.trackProps;
      return trackProps ? _utils.C.getPaddingValues(trackProps.padding, trackProps.paddingLeft, trackProps.paddingRight, trackProps.paddingTop, trackProps.paddingBottom) : {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      };
    }
  }, {
    key: "contentMargin",
    get: function get() {
      var _this$state4 = this.state,
          thumbWidth = _this$state4.thumbWidth,
          trackWidth = _this$state4.trackWidth;
      var windowsScrollWidth = 20;
      var marginWidth = trackWidth > thumbWidth ? trackWidth : thumbWidth;
      var margin = (0, _utils.isMacOs)() ? marginWidth + windowsScrollWidth : marginWidth;
      return !(0, _utils.isMobile)() && this.shouldRenderScrollbar ? "".concat(margin + 10, "px") : '20px';
    }
  }, {
    key: "rightOffset",
    get: function get() {
      return this.state.thumbWidth > this.state.trackWidth ? (this.state.thumbWidth - this.state.trackWidth) / 2 : 0;
    }
  }]);
  return ReactSmartScrollerVertical;
}(_react.default.Component);

exports.ReactSmartScrollerVertical = ReactSmartScrollerVertical;

var Content = _styledComponents.default.div(_templateObject());

exports.Content = Content;

var ChildrenWrapper = _styledComponents.default.div(_templateObject2());

exports.ChildrenWrapper = ChildrenWrapper;

var Track = _styledComponents.default.div(_templateObject3(), _styles.colors.gray.mediumGray);

exports.Track = Track;

var RectangleThumb = _styledComponents.default.div(_templateObject4(), _styles.colors.primary);

exports.RectangleThumb = RectangleThumb;

var EmptyAbsolute = _styledComponents.default.div(_templateObject5());

exports.EmptyAbsolute = EmptyAbsolute;