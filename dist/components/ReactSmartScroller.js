"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Wrapper = exports.ReactSmartScroller = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _utils = require("../lib/utils");

var _ReactSmartScrollerVertical = require("./ReactSmartScrollerVertical");

var _ReactSmartScrollerHorizontal = require("./ReactSmartScrollerHorizontal");

var _ReactSmartScrollerPagination = require("./ReactSmartScrollerPagination");

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2.default)(["\n    width: 100%;\n    height: 100%;\n    overflow: hidden;\n    position: relative;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var ReactSmartScroller =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(ReactSmartScroller, _React$Component);

  function ReactSmartScroller() {
    (0, _classCallCheck2.default)(this, ReactSmartScroller);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ReactSmartScroller).apply(this, arguments));
  }

  (0, _createClass2.default)(ReactSmartScroller, [{
    key: "renderMain",
    value: function renderMain() {
      if (this.props.pagination) {
        return _react.default.createElement(_ReactSmartScrollerPagination.ReactSmartScrollerPagination, this.props);
      }

      return this.props.vertical ? _react.default.createElement(_ReactSmartScrollerVertical.ReactSmartScrollerVertical, this.props) : _react.default.createElement(_ReactSmartScrollerHorizontal.ReactSmartScrollerHorizontal, this.props);
    }
  }, {
    key: "render",
    value: function render() {
      return !_utils.isServer ? _react.default.createElement(Wrapper, null, this.renderMain()) : null;
    }
  }]);
  return ReactSmartScroller;
}(_react.default.Component);

exports.ReactSmartScroller = ReactSmartScroller;

var Wrapper = _styledComponents.default.div(_templateObject());

exports.Wrapper = Wrapper;