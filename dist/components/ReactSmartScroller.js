import _objectSpread from "@babel/runtime/helpers/objectSpread";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { colors } from "../lib/styles";
import { C, isMobile, isMacOs } from "../lib/utils";
import { ReactSmartScrollerVertical } from "./ReactSmartScrollerVertical";
export class ReactSmartScroller extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "state", {
      scrollContainerWidth: 0,
      deltaXOrigin: 0,
      deltaX: 0,
      thumbHeight: 0,
      trackHeight: 0,
      scrollWidth: 0
    });

    _defineProperty(this, "overflowContainerRef", React.createRef());

    _defineProperty(this, "thumbRef", React.createRef());

    _defineProperty(this, "trackRef", React.createRef());

    this.measureContainers = this.measureContainers.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseDrag = this.onMouseDrag.bind(this);
    this.onOverflowContentScroll = this.onOverflowContentScroll.bind(this);
    this.deleteMouseMoveEvent = this.deleteMouseMoveEvent.bind(this);
    this.onScrollbarClick = this.onScrollbarClick.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.measureContainers);
    window.addEventListener('mouseup', this.deleteMouseMoveEvent);
    this.measureContainers();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.measureContainers);
    window.removeEventListener('mouseup', this.deleteMouseMoveEvent);
  }

  get shouldRenderScrollbar() {
    const overflownRef = this.overflowContainerRef.current;
    const cols = this.props.numCols;

    if (!cols && overflownRef) {
      return overflownRef.clientWidth < overflownRef.scrollWidth;
    }

    return !(overflownRef && overflownRef.children.length <= cols);
  }

  get contentMargin() {
    const {
      thumbHeight,
      trackHeight
    } = this.state;
    const windowsScrollHeight = 20;
    const marginHeight = trackHeight > thumbHeight ? trackHeight : thumbHeight;
    const margin = isMacOs() ? marginHeight + windowsScrollHeight : marginHeight;
    return !isMobile() && this.shouldRenderScrollbar ? `${margin + 10}px` : '20px';
  }

  get bottomOffset() {
    return this.state.thumbHeight > this.state.trackHeight ? (this.state.thumbHeight - this.state.trackHeight) / 2 : 0;
  }

  scrollContainerReducedWidth(scrollContainerWidth) {
    const {
      trackProps
    } = this.props;

    if (trackProps) {
      const scrollPadding = C.getPaddingValues(trackProps.padding, trackProps.paddingLeft, trackProps.paddingRight, trackProps.paddingTop, trackProps.paddingBottom);
      const padding = scrollPadding ? scrollPadding.left + scrollPadding.right : 0;
      return scrollContainerWidth - padding;
    }

    return scrollContainerWidth;
  }

  measureContainers() {
    const overflownRef = this.overflowContainerRef.current;
    const thumbRef = this.thumbRef.current;
    const trackRef = this.trackRef.current;
    const areRefsCurrent = C.all(overflownRef, thumbRef, trackRef);

    if (areRefsCurrent) {
      this.setState({
        scrollContainerWidth: this.scrollContainerReducedWidth(overflownRef.clientWidth),
        thumbHeight: thumbRef.offsetHeight,
        trackHeight: trackRef.clientHeight,
        scrollWidth: overflownRef.scrollWidth
      });
    }

    if (areRefsCurrent && thumbRef.offsetLeft + thumbRef.clientWidth > overflownRef.clientWidth) {
      const scrollCircleLeftOffset = thumbRef.offsetLeft + thumbRef.clientWidth;
      const scrollOffset = scrollCircleLeftOffset > overflownRef.clientWidth ? overflownRef.clientWidth - thumbRef.clientWidth : thumbRef.offsetLeft;
      overflownRef.scroll(overflownRef.scrollWidth, 0);
      thumbRef.style.left = `${scrollOffset}px`;
    }
  }

  onMouseDown(event) {
    event.preventDefault();
    const {
      trackProps
    } = this.props;
    const scrollPadding = trackProps ? C.getPaddingValues(trackProps.padding, trackProps.paddingLeft, trackProps.paddingRight) : null;
    const padding = scrollPadding ? scrollPadding.left : 0;

    if (this.thumbRef.current) {
      this.setState({
        deltaXOrigin: this.thumbRef.current.offsetLeft,
        deltaX: event.clientX + padding
      });
    }

    window.addEventListener('mousemove', this.onMouseDrag);
  }

  onScrollbarClick({
    clientX
  }) {
    const thumbRef = this.thumbRef.current;
    const overflowRef = this.overflowContainerRef.current;
    const shouldReturn = C.all(thumbRef, overflowRef, clientX >= thumbRef.offsetLeft + overflowRef.getBoundingClientRect().left, clientX <= thumbRef.offsetLeft + overflowRef.getBoundingClientRect().left + thumbRef.offsetWidth); // leave this function if thumb was clicked

    if (shouldReturn) {
      return null;
    }

    const maximumOffset = this.state.scrollContainerWidth - thumbRef.offsetWidth;
    const ratio = (overflowRef.scrollWidth - overflowRef.clientWidth) / maximumOffset;
    const deltaX = overflowRef.getBoundingClientRect().left + thumbRef.offsetWidth / 2;
    return overflowRef.scroll({
      left: ratio * (clientX - deltaX),
      top: 0,
      behavior: 'smooth'
    });
  }

  deleteMouseMoveEvent() {
    window.removeEventListener('mousemove', this.onMouseDrag);
  }

  onMouseDrag(event) {
    const zero = 0;
    const {
      deltaX,
      deltaXOrigin,
      scrollContainerWidth
    } = this.state;
    const overflowRef = this.overflowContainerRef.current;
    const thumbRef = this.thumbRef.current;
    const maximumOffset = scrollContainerWidth - thumbRef.offsetWidth;
    const offset = event.clientX - deltaX + deltaXOrigin;
    const isBetweenClientWidth = offset >= zero && offset <= maximumOffset;
    const areRefsCurrent = C.all(Boolean(this.overflowContainerRef.current), Boolean(this.thumbRef.current));

    if (areRefsCurrent && !isBetweenClientWidth) {
      const criticalDimension = offset < zero ? zero : maximumOffset;
      const criticalScrollerDimensions = offset > zero ? overflowRef.scrollWidth - overflowRef.clientWidth : zero;
      thumbRef.style.left = `${criticalDimension}px`;
      overflowRef.scroll(criticalScrollerDimensions, zero);
    }

    if (areRefsCurrent && isBetweenClientWidth) {
      const ratio = (overflowRef.scrollWidth - overflowRef.clientWidth) / maximumOffset;
      overflowRef.scroll(ratio * offset, zero);
      thumbRef.style.left = `${offset}px`;
    }
  }

  onOverflowContentScroll() {
    const {
      scrollContainerWidth
    } = this.state;
    const thumbRef = this.thumbRef.current;
    const overflowRef = this.overflowContainerRef.current;

    if (overflowRef && thumbRef) {
      const maximumOffset = scrollContainerWidth - thumbRef.offsetWidth;
      const ratio = maximumOffset / (overflowRef.scrollWidth - overflowRef.clientWidth);
      thumbRef.style.left = `${overflowRef.scrollLeft * ratio}px`;
    }
  }

  renderChildren() {
    const cols = this.props.numCols;
    const spacing = this.props.spacing;
    const padding = spacing / 2;
    const children = this.props.children;
    return React.Children.map(children, (child, index) => {
      const paddingRight = index !== React.Children.count(children) - 1 ? `paddingRight: ${padding}px` : undefined;
      const paddingLeft = index !== 0 ? `paddingLeft: ${padding}px` : undefined;
      const flexBasis = cols ? `calc(100% / ${cols})` : 'unset';
      return React.createElement(ChildrenWrapper, {
        style: {
          padding: `0 ${padding}px`,
          flexBasis,
          paddingRight,
          paddingLeft,
          marginBottom: this.contentMargin
        }
      }, child);
    });
  }

  renderThumb() {
    const {
      scrollContainerWidth,
      scrollWidth,
      thumbHeight,
      trackHeight
    } = this.state;
    const percentageWidth = Number((scrollContainerWidth * 100 / scrollWidth).toFixed(0));
    const width = `${percentageWidth * scrollContainerWidth / 100}px`;
    const bottom = this.bottomOffset !== 0 ? this.bottomOffset : (thumbHeight - trackHeight) / 2;

    if (this.props.thumb) {
      return React.cloneElement(this.props.thumb, {
        ref: this.thumbRef,
        onMouseDown: this.onMouseDown,
        style: _objectSpread({
          left: 0,
          position: 'relative',
          cursor: 'pointer',
          bottom
        }, this.props.thumb.props.style)
      });
    }

    return React.createElement(RectangleThumb, {
      ref: this.thumbRef,
      onMouseDown: this.onMouseDown,
      style: {
        width,
        bottom
      }
    });
  }

  renderScrollbar() {
    const display = !isMobile() && this.shouldRenderScrollbar;
    return React.createElement(Track, {
      ref: this.trackRef,
      onClick: this.onScrollbarClick,
      style: _objectSpread({
        color: colors.gray.mediumGray,
        bottom: this.bottomOffset,
        display: display ? 'block' : 'none'
      }, this.props.trackProps)
    }, this.renderThumb());
  }

  renderContent() {
    return !this.props.vertical ? React.createElement(Fragment, null, React.createElement(SecondWrapper, {
      ref: this.overflowContainerRef,
      onScroll: this.onOverflowContentScroll,
      onLoad: this.measureContainers
    }, this.renderChildren()), this.renderScrollbar()) : React.createElement(ReactSmartScrollerVertical, this.props);
  }

  render() {
    return React.createElement(Wrapper, null, this.renderContent());
  }

}

_defineProperty(ReactSmartScroller, "defaultProps", {
  spacing: 0,
  vertical: false
});

export const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
`;
export const SecondWrapper = styled.div`
    display: flex;
    overflow-x: scroll;
    overflow-y: hidden;
    margin-bottom: -20px;
    -webkit-overflow-scrolling: touch;
`;
export const ChildrenWrapper = styled.div`
    flex: 0 0 auto;
`;
export const Track = styled.div`
    position: absolute;
    cursor: pointer;
    left: 0;
    width: 100%;
    background-color: ${colors.gray.mediumGray};
    bottom: 0;
    height: 10px;
`;
export const RectangleThumb = styled.div`
    position: relative;
    left: 0;
    background-color: ${colors.primary};
    cursor: pointer;
    width: 100px;
    height: 10px;
`;