"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Dot = exports.RightArrow = exports.LeftArrow = exports.Pagination = exports.ChildrenWrapper = exports.Container = exports.ContainerWrapper = exports.ReactSmartScrollerPagination = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _styles = require("../lib/styles");

var _utils = require("../lib/utils");

function _templateObject7() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n    width: 20px;\n    height: 20px;\n    border-radius: 50%;\n    margin: 0 3px;\n    cursor: pointer;\n"]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n    border: solid ", ";\n    border-width: 0 2px 2px 0;\n    display: inline-block;\n    padding: 6px;\n    transform: rotate(-45deg);\n    -webkit-transform: rotate(-45deg);\n    cursor: pointer;\n"]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n    border: solid ", ";\n    border-width: 0 2px 2px 0;\n    display: inline-block;\n    padding: 6px;\n    transform: rotate(135deg);\n    -webkit-transform: rotate(135deg);\n    cursor: pointer;\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    height: 40px;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n    flex: 0 0 auto;\n    box-sizing: border-box;\n    width: 100%;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n    display: flex;\n    position: relative;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n    display: flex;\n    flex-direction: column;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var ReactSmartScrollerPagination =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(ReactSmartScrollerPagination, _React$Component);

  function ReactSmartScrollerPagination(props) {
    var _this;

    (0, _classCallCheck2.default)(this, ReactSmartScrollerPagination);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ReactSmartScrollerPagination).call(this, props));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      paginationIndex: 0,
      numberOfViews: 0,
      scrollValue: 0,
      children: _this.props.children,
      deltaX: 0,
      scrollLeft: 0,
      dragScroll: 0,
      deltaY: 0,
      horizontal: false,
      lockedMove: false
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "overflowContainerRef", _react.default.createRef());
    _this.onNext = _this.onNext.bind((0, _assertThisInitialized2.default)(_this));
    _this.onPrevious = _this.onPrevious.bind((0, _assertThisInitialized2.default)(_this));
    _this.onDotClick = _this.onDotClick.bind((0, _assertThisInitialized2.default)(_this));
    _this.onTouchMove = _this.onTouchMove.bind((0, _assertThisInitialized2.default)(_this));
    _this.onTouchStart = _this.onTouchStart.bind((0, _assertThisInitialized2.default)(_this));
    _this.onOverflowContentDrag = _this.onOverflowContentDrag.bind((0, _assertThisInitialized2.default)(_this));
    _this.onOverflowContentMouseDown = _this.onOverflowContentMouseDown.bind((0, _assertThisInitialized2.default)(_this));
    _this.deleteOverflowMouseMoveEvent = _this.deleteOverflowMouseMoveEvent.bind((0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  (0, _createClass2.default)(ReactSmartScrollerPagination, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        numberOfViews: this.numberOfViews
      });
      window.addEventListener('touchstart', this.onTouchStart);
      window.addEventListener('touchmove', this.onTouchMove, {
        passive: false
      });
      window.addEventListener('touchend', this.deleteOverflowMouseMoveEvent);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener('touchstart', this.onTouchStart);
      window.removeEventListener('mousemove', this.onOverflowContentDrag);
      window.removeEventListener('mouseup', this.deleteOverflowMouseMoveEvent);
      window.removeEventListener('touchmove', this.onTouchMove);
      window.removeEventListener('touchend', this.deleteOverflowMouseMoveEvent);
    }
  }, {
    key: "onNext",
    value: function onNext() {
      var overflowRef = this.overflowContainerRef.current;
      var _this$state = this.state,
          paginationIndex = _this$state.paginationIndex,
          scrollValue = _this$state.scrollValue;
      var paginationConfig = this.props.paginationConfig;

      if (overflowRef && paginationIndex === this.numberOfViews - 1 && paginationConfig && paginationConfig.infinite) {
        overflowRef.style.transform = "translate(0px)";
        return this.setState({
          paginationIndex: 0,
          scrollValue: 0
        });
      }

      if (overflowRef && paginationIndex < this.numberOfViews - 1) {
        var newScrollValue = scrollValue - overflowRef.offsetWidth;
        var index = paginationIndex + 1;
        overflowRef.style.transform = "translate(".concat(newScrollValue, "px)");
        return this.setState({
          paginationIndex: index,
          scrollValue: newScrollValue
        });
      }
    }
  }, {
    key: "onPrevious",
    value: function onPrevious() {
      var overflowRef = this.overflowContainerRef.current;
      var _this$state2 = this.state,
          paginationIndex = _this$state2.paginationIndex,
          scrollValue = _this$state2.scrollValue;
      var paginationConfig = this.props.paginationConfig;

      if (overflowRef && paginationIndex === 0 && paginationConfig && paginationConfig.infinite) {
        var index = this.numberOfViews - 1;
        var newScrollValue = index * overflowRef.offsetWidth;
        overflowRef.style.transform = "translate(-".concat(newScrollValue, "px)");
        return this.setState({
          paginationIndex: index,
          scrollValue: -newScrollValue
        });
      }

      if (overflowRef && paginationIndex > 0) {
        var _index = paginationIndex - 1;

        var _newScrollValue = scrollValue + overflowRef.offsetWidth;

        overflowRef.style.transform = "translate(".concat(_newScrollValue, "px)");
        return this.setState({
          paginationIndex: _index,
          scrollValue: _newScrollValue
        });
      }
    }
  }, {
    key: "onDotClick",
    value: function onDotClick(index) {
      var overflowRef = this.overflowContainerRef.current;
      var paginationIndex = this.state.paginationIndex;

      if (overflowRef && index !== paginationIndex) {
        var newScrollValue = -(index * overflowRef.clientWidth);
        overflowRef.style.transform = "translate(".concat(newScrollValue, "px)");
        this.setState({
          paginationIndex: index,
          scrollValue: newScrollValue
        });
      }
    }
  }, {
    key: "onOverflowContentMouseDown",
    value: function onOverflowContentMouseDown(event) {
      event.preventDefault();
      var overflowRef = this.overflowContainerRef.current;
      var paginationConfig = this.props.paginationConfig;

      if (overflowRef && paginationConfig && paginationConfig.draggable) {
        overflowRef.style.transition = 'unset';
        overflowRef.style.transform = "translate(".concat(this.state.scrollValue, "px)");
        this.setState({
          deltaX: event.clientX,
          scrollLeft: this.state.scrollValue,
          dragScroll: this.state.scrollValue
        });
        window.addEventListener('mousemove', this.onOverflowContentDrag);
        window.addEventListener('mouseup', this.deleteOverflowMouseMoveEvent);
      }
    }
  }, {
    key: "onOverflowContentDrag",
    value: function onOverflowContentDrag(event) {
      var _this$state3 = this.state,
          deltaX = _this$state3.deltaX,
          scrollLeft = _this$state3.scrollLeft;
      var overflowRef = this.overflowContainerRef.current;
      var dragScroll = scrollLeft + (event.clientX - deltaX);

      if (overflowRef && event.clientX !== 0) {
        overflowRef.style.transform = "translate(".concat(dragScroll, "px)");
        this.setState({
          dragScroll: dragScroll
        });
      }
    }
  }, {
    key: "onTouchStart",
    value: function onTouchStart(event) {
      var scrollValue = this.state.scrollValue;
      var touch = event.touches.item(0);
      var overflowRef = this.overflowContainerRef.current;
      this.setState({
        deltaX: touch.clientX,
        scrollLeft: scrollValue,
        dragScroll: scrollValue,
        deltaY: touch.clientY,
        horizontal: false,
        lockedMove: false
      });

      if (overflowRef) {
        overflowRef.style.transition = 'unset';
      }
    }
  }, {
    key: "onTouchMove",
    value: function onTouchMove(event) {
      var _this$state4 = this.state,
          deltaX = _this$state4.deltaX,
          scrollLeft = _this$state4.scrollLeft,
          deltaY = _this$state4.deltaY,
          horizontal = _this$state4.horizontal,
          lockedMove = _this$state4.lockedMove;
      var touch = event.touches.item(0);
      var overflowRef = this.overflowContainerRef.current;
      var dragScroll = scrollLeft + (touch.clientX - deltaX);
      var element = touch.target;
      var paginationConfig = this.props.paginationConfig;
      var minOffset = paginationConfig && paginationConfig.minOffsetToChangeSlide || 50;

      if (overflowRef && element.parentNode.parentNode !== overflowRef || !horizontal && lockedMove) {
        return null;
      }

      if (Math.abs(touch.clientY - deltaY) > minOffset && !lockedMove) {
        this.setState({
          horizontal: false,
          lockedMove: true
        });
      }

      if (Math.abs(touch.clientX - deltaX) > minOffset && !lockedMove) {
        this.setState({
          horizontal: true,
          lockedMove: true
        });
      }

      if (Math.abs(touch.clientX - deltaX) > minOffset) {
        event.preventDefault();
      }

      if (overflowRef && touch.clientX !== 0) {
        overflowRef.style.transform = "translate(".concat(dragScroll, "px)");
        this.setState({
          dragScroll: dragScroll
        });
      }
    }
  }, {
    key: "deleteOverflowMouseMoveEvent",
    value: function deleteOverflowMouseMoveEvent() {
      var overflowRef = this.overflowContainerRef.current;
      var _this$state5 = this.state,
          dragScroll = _this$state5.dragScroll,
          paginationIndex = _this$state5.paginationIndex,
          scrollLeft = _this$state5.scrollLeft;
      var paginationConfig = this.props.paginationConfig;
      var minOffset = paginationConfig && paginationConfig.minOffsetToChangeSlide || 150;
      var transition = paginationConfig && paginationConfig.transitionTime || 1;

      if (overflowRef && -scrollLeft + dragScroll < -minOffset) {
        var isLastSlide = paginationIndex === this.childrenCount - 1;
        var newValue = isLastSlide ? paginationIndex * overflowRef.clientWidth : (paginationIndex + 1) * overflowRef.clientWidth;
        overflowRef.style.transition = "all ".concat(transition, "s");
        overflowRef.style.transform = "translate(-".concat(newValue, "px)");
        this.setState({
          paginationIndex: isLastSlide ? paginationIndex : paginationIndex + 1,
          scrollValue: -newValue
        });
      }

      if (overflowRef && -scrollLeft + dragScroll > minOffset) {
        var isFirstSlide = paginationIndex === 0;

        var _newValue = isFirstSlide ? 0 : (paginationIndex - 1) * overflowRef.clientWidth;

        overflowRef.style.transition = "all ".concat(transition, "s");
        overflowRef.style.transform = "translate(-".concat(_newValue, "px)");
        this.setState({
          paginationIndex: isFirstSlide ? paginationIndex : paginationIndex - 1,
          scrollValue: -_newValue
        });
      }

      var shouldReturn = _utils.C.all(overflowRef, -scrollLeft + dragScroll > -minOffset, -scrollLeft + dragScroll < minOffset);

      if (shouldReturn) {
        overflowRef.style.transition = "all ".concat(transition, "s");
        overflowRef.style.transform = "translate(-".concat(paginationIndex * overflowRef.clientWidth, "px)");
      }

      window.removeEventListener('mousemove', this.onOverflowContentDrag);
      window.removeEventListener('mouseup', this.deleteOverflowMouseMoveEvent);
    }
  }, {
    key: "renderChildren",
    value: function renderChildren() {
      var cols = this.props.numCols;
      var spacing = this.props.spacing;
      var padding = spacing / 2;
      var children = this.state.children;
      return _react.default.Children.map(children, function (child, index) {
        var paddingRight = index !== _react.default.Children.count(children) - 1 ? "paddingRight: ".concat(padding, "px") : undefined;
        var paddingLeft = index !== 0 ? "paddingLeft: ".concat(padding, "px") : undefined;
        var flexBasis = cols ? "calc(100% / ".concat(cols, ")") : 'unset';
        return _react.default.createElement(ChildrenWrapper, {
          style: {
            padding: "0 ".concat(padding, "px"),
            flexBasis: flexBasis,
            paddingRight: paddingRight,
            paddingLeft: paddingLeft
          }
        }, child);
      });
    }
  }, {
    key: "renderDots",
    value: function renderDots() {
      var _this2 = this;

      var paginationConfig = this.props.paginationConfig;
      return Array.from(Array(this.numberOfViews)).map(function (_, index) {
        var backgroundColor = _this2.state.paginationIndex === index ? paginationConfig && paginationConfig.activeDotColor || _styles.colors.primary : paginationConfig && paginationConfig.unactiveDotsColor || _styles.colors.gray.mediumGray;
        return _react.default.createElement(Dot, {
          key: index,
          style: {
            backgroundColor: backgroundColor
          },
          onClick: function onClick() {
            return _this2.onDotClick(index);
          }
        });
      });
    }
  }, {
    key: "renderPagination",
    value: function renderPagination() {
      var renderPagination = this.props.renderPagination;

      if (renderPagination) {
        return renderPagination({
          selectedDot: this.state.paginationIndex,
          onPrev: this.onPrevious,
          onNext: this.onNext,
          childrenCount: this.childrenCount,
          onDotClick: this.onDotClick
        });
      }

      return _react.default.createElement(Pagination, null, _react.default.createElement(LeftArrow, {
        onClick: this.onPrevious
      }), this.renderDots(), _react.default.createElement(RightArrow, {
        onClick: this.onNext
      }));
    }
  }, {
    key: "render",
    value: function render() {
      var paginationConfig = this.props.paginationConfig;
      var transition = paginationConfig && paginationConfig.transitionTime || 1;
      return _react.default.createElement(ContainerWrapper, null, _react.default.createElement(Container, {
        ref: this.overflowContainerRef,
        style: {
          transition: "all ".concat(transition, "s")
        },
        onMouseDown: (0, _utils.isMobile)() ? _utils.C.noop : this.onOverflowContentMouseDown
      }, this.renderChildren()), this.renderPagination());
    }
  }, {
    key: "childrenCount",
    get: function get() {
      return _react.default.Children.count(this.props.children);
    }
  }, {
    key: "numberOfViews",
    get: function get() {
      var numCols = this.props.numCols || 1;
      return Math.ceil(this.childrenCount / numCols);
    }
  }]);
  return ReactSmartScrollerPagination;
}(_react.default.Component);

exports.ReactSmartScrollerPagination = ReactSmartScrollerPagination;

var ContainerWrapper = _styledComponents.default.div(_templateObject());

exports.ContainerWrapper = ContainerWrapper;

var Container = _styledComponents.default.div(_templateObject2());

exports.Container = Container;

var ChildrenWrapper = _styledComponents.default.div(_templateObject3());

exports.ChildrenWrapper = ChildrenWrapper;

var Pagination = _styledComponents.default.div(_templateObject4());

exports.Pagination = Pagination;

var LeftArrow = _styledComponents.default.div(_templateObject5(), _styles.colors.black);

exports.LeftArrow = LeftArrow;

var RightArrow = _styledComponents.default.div(_templateObject6(), _styles.colors.black);

exports.RightArrow = RightArrow;

var Dot = _styledComponents.default.div(_templateObject7());

exports.Dot = Dot;