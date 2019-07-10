"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RectangleThumb = exports.Track = exports.ChildrenWrapper = exports.SecondWrapper = exports.ReactSmartScrollerHorizontal = void 0;

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

var _styles = require("../lib/styles");

var _utils = require("../lib/utils");

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n    position: relative;\n    left: 0;\n    background-color: ", ";\n    cursor: pointer;\n    width: 100px;\n    height: 10px;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n    position: absolute;\n    cursor: pointer;\n    left: 0;\n    width: 100%;\n    background-color: ", ";\n    bottom: 0;\n    height: 10px;\n    display: flex;\n    align-items: center;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n    flex: 0 0 auto;\n    box-sizing: border-box;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n    display: flex;\n    overflow-x: scroll;\n    overflow-y: hidden;\n    margin-bottom: -20px;\n    -webkit-overflow-scrolling: touch;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var ReactSmartScrollerHorizontal =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(ReactSmartScrollerHorizontal, _React$Component);

  function ReactSmartScrollerHorizontal(props) {
    var _this;

    (0, _classCallCheck2.default)(this, ReactSmartScrollerHorizontal);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ReactSmartScrollerHorizontal).call(this, props));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      scrollContainerWidth: 0,
      deltaXOrigin: 0,
      deltaX: 0,
      thumbHeight: 0,
      trackHeight: 0,
      scrollWidth: 0,
      scrollLeft: 0,
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
    _this.onOverflowContentDrag = _this.onOverflowContentDrag.bind((0, _assertThisInitialized2.default)(_this));
    _this.onOverflowContentMouseDown = _this.onOverflowContentMouseDown.bind((0, _assertThisInitialized2.default)(_this));
    _this.deleteOverflowMouseMoveEvent = _this.deleteOverflowMouseMoveEvent.bind((0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  (0, _createClass2.default)(ReactSmartScrollerHorizontal, [{
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
    key: "scrollContainerReducedWidth",
    value: function scrollContainerReducedWidth(scrollContainerWidth) {
      var padding = this.state.padding;
      return scrollContainerWidth - (padding.left + padding.right);
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
          scrollContainerWidth: this.scrollContainerReducedWidth(overflownRef.clientWidth),
          thumbHeight: thumbRef.offsetHeight,
          trackHeight: trackRef.clientHeight,
          scrollWidth: overflownRef.scrollWidth
        });
      }

      if (areRefsCurrent && thumbRef.offsetLeft + thumbRef.clientWidth > overflownRef.clientWidth) {
        var scrollOffset = overflownRef.clientWidth - thumbRef.clientWidth;
        overflownRef.scroll(overflownRef.scrollWidth, 0);
        thumbRef.style.left = "".concat(scrollOffset, "px");
      }
    }
  }, {
    key: "onMouseDown",
    value: function onMouseDown(event) {
      event.preventDefault();

      if (this.thumbRef.current) {
        this.setState({
          deltaXOrigin: this.thumbRef.current.offsetLeft,
          deltaX: event.clientX + this.state.padding.left
        });
      }

      window.addEventListener('mousemove', this.onMouseDrag);
    }
  }, {
    key: "onScrollbarClick",
    value: function onScrollbarClick(_ref) {
      var clientX = _ref.clientX;
      var thumbRef = this.thumbRef.current;
      var overflowRef = this.overflowContainerRef.current;

      var shouldReturn = _utils.C.all(thumbRef, overflowRef, clientX >= thumbRef.offsetLeft + overflowRef.getBoundingClientRect().left, clientX <= thumbRef.offsetLeft + overflowRef.getBoundingClientRect().left + thumbRef.offsetWidth); // leave this function if thumb was clicked


      if (shouldReturn) {
        return null;
      }

      var maximumOffset = this.state.scrollContainerWidth - thumbRef.offsetWidth;
      var ratio = (overflowRef.scrollWidth - overflowRef.clientWidth) / maximumOffset;
      var deltaX = overflowRef.getBoundingClientRect().left + thumbRef.offsetWidth / 2 + this.state.padding.left;
      return overflowRef.scroll({
        left: ratio * (clientX - deltaX),
        top: 0,
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
          deltaX = _this$state.deltaX,
          deltaXOrigin = _this$state.deltaXOrigin,
          scrollContainerWidth = _this$state.scrollContainerWidth;
      var overflowRef = this.overflowContainerRef.current;
      var thumbRef = this.thumbRef.current;
      var maximumOffset = scrollContainerWidth - thumbRef.offsetWidth;
      var offset = event.clientX - deltaX + deltaXOrigin;
      var isBetweenClientWidth = offset >= zero && offset <= maximumOffset;

      var areRefsCurrent = _utils.C.all(Boolean(this.overflowContainerRef.current), Boolean(this.thumbRef.current));

      if (areRefsCurrent && !isBetweenClientWidth) {
        var criticalDimension = offset < zero ? zero : maximumOffset;
        var criticalScrollerDimensions = offset > zero ? overflowRef.scrollWidth - overflowRef.clientWidth : zero;
        thumbRef.style.left = "".concat(criticalDimension, "px");
        overflowRef.scroll(criticalScrollerDimensions, zero);
      }

      if (areRefsCurrent && isBetweenClientWidth) {
        var ratio = (overflowRef.scrollWidth - overflowRef.clientWidth) / maximumOffset;
        overflowRef.scroll(ratio * offset, zero);
        thumbRef.style.left = "".concat(offset, "px");
      }
    }
  }, {
    key: "onOverflowContentScroll",
    value: function onOverflowContentScroll() {
      var scrollContainerWidth = this.state.scrollContainerWidth;
      var thumbRef = this.thumbRef.current;
      var overflowRef = this.overflowContainerRef.current;

      if (overflowRef && thumbRef) {
        var maximumOffset = scrollContainerWidth - thumbRef.offsetWidth;
        var ratio = maximumOffset / (overflowRef.scrollWidth - overflowRef.clientWidth);
        thumbRef.style.left = "".concat(overflowRef.scrollLeft * ratio, "px");
      }
    }
  }, {
    key: "onOverflowContentMouseDown",
    value: function onOverflowContentMouseDown(event) {
      event.preventDefault();
      var overflowRef = this.overflowContainerRef.current;

      if (overflowRef) {
        this.setState({
          deltaX: event.clientX,
          scrollLeft: overflowRef.scrollLeft
        });
      }

      window.addEventListener('mousemove', this.onOverflowContentDrag);
    }
  }, {
    key: "onOverflowContentDrag",
    value: function onOverflowContentDrag(event) {
      var _this$state2 = this.state,
          deltaX = _this$state2.deltaX,
          scrollLeft = _this$state2.scrollLeft;
      var overflowRef = this.overflowContainerRef.current;

      if (overflowRef && event.clientX !== 0) {
        overflowRef.scroll(scrollLeft - (event.clientX - deltaX), 0);
      }
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
        var paddingRight = index !== _react.default.Children.count(children) - 1 ? "paddingRight: ".concat(padding, "px") : undefined;
        var paddingLeft = index !== 0 ? "paddingLeft: ".concat(padding, "px") : undefined;
        var flexBasis = cols ? "calc(100% / ".concat(cols, ")") : 'unset';
        return _react.default.createElement(ChildrenWrapper, {
          style: {
            padding: "0 ".concat(padding, "px"),
            flexBasis: flexBasis,
            paddingRight: paddingRight,
            paddingLeft: paddingLeft,
            marginBottom: _this2.contentMargin
          }
        }, child);
      });
    }
  }, {
    key: "renderThumb",
    value: function renderThumb() {
      var _this$state3 = this.state,
          scrollContainerWidth = _this$state3.scrollContainerWidth,
          scrollWidth = _this$state3.scrollWidth;
      var percentageWidth = Number((scrollContainerWidth * 100 / scrollWidth).toFixed(0));
      var width = "".concat(percentageWidth * scrollContainerWidth / 100, "px");

      if (this.props.thumb) {
        return _react.default.cloneElement(this.props.thumb, {
          ref: this.thumbRef,
          onMouseDown: this.onMouseDown,
          style: (0, _objectSpread2.default)({
            left: 0,
            position: 'relative',
            cursor: 'pointer'
          }, this.props.thumb.props.style)
        });
      }

      return _react.default.createElement(RectangleThumb, {
        ref: this.thumbRef,
        onMouseDown: this.onMouseDown,
        style: {
          width: width
        }
      });
    }
  }, {
    key: "renderScrollbar",
    value: function renderScrollbar() {
      var display = !(0, _utils.isMobile)() && this.shouldRenderScrollbar && !this.props.pagination;
      return _react.default.createElement(Track, {
        ref: this.trackRef,
        onClick: this.onScrollbarClick,
        style: (0, _objectSpread2.default)({
          color: _styles.colors.gray.mediumGray,
          bottom: this.bottomOffset,
          display: display ? 'flex' : 'none'
        }, this.props.trackProps)
      }, this.renderThumb());
    }
  }, {
    key: "render",
    value: function render() {
      var draggable = this.props.draggable;
      var cursor = draggable ? 'pointer' : 'unset';
      return _react.default.createElement(_react.Fragment, null, _react.default.createElement(SecondWrapper, {
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
        return overflownRef.clientWidth < overflownRef.scrollWidth;
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
          thumbHeight = _this$state4.thumbHeight,
          trackHeight = _this$state4.trackHeight;
      var windowsScrollHeight = 20;
      var marginHeight = trackHeight > thumbHeight ? trackHeight : thumbHeight;
      var margin = (0, _utils.isMacOs)() ? marginHeight + windowsScrollHeight : marginHeight;
      return !(0, _utils.isMobile)() && this.shouldRenderScrollbar ? "".concat(margin + 10, "px") : '20px';
    }
  }, {
    key: "bottomOffset",
    get: function get() {
      return this.state.thumbHeight > this.state.trackHeight ? (this.state.thumbHeight - this.state.trackHeight) / 2 : 0;
    }
  }]);
  return ReactSmartScrollerHorizontal;
}(_react.default.Component);

exports.ReactSmartScrollerHorizontal = ReactSmartScrollerHorizontal;
(0, _defineProperty2.default)(ReactSmartScrollerHorizontal, "defaultProps", {
  spacing: 0,
  vertical: false,
  draggable: false,
  pagination: false
});

var SecondWrapper = _styledComponents.default.div(_templateObject());

exports.SecondWrapper = SecondWrapper;

var ChildrenWrapper = _styledComponents.default.div(_templateObject2());

exports.ChildrenWrapper = ChildrenWrapper;

var Track = _styledComponents.default.div(_templateObject3(), _styles.colors.gray.mediumGray);

exports.Track = Track;

var RectangleThumb = _styledComponents.default.div(_templateObject4(), _styles.colors.primary);

exports.RectangleThumb = RectangleThumb;