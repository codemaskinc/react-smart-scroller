import _objectSpread from "@babel/runtime/helpers/objectSpread";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { C, isMacOs, isMobile } from "../lib/utils";
import { colors } from "../lib/styles";
export class ReactSmartScrollerVertical extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "state", {
      scrollContainerHeight: 0,
      deltaYOrigin: 0,
      deltaY: 0,
      thumbWidth: 0,
      trackWidth: 0,
      scrollHeight: 0,
      scrollTop: 0,
      padding: this.trackPadding
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
    this.onOverflowContentMouseDown = this.onOverflowContentMouseDown.bind(this);
    this.onOverflowContentDrag = this.onOverflowContentDrag.bind(this);
    this.deleteOverflowMouseMoveEvent = this.deleteOverflowMouseMoveEvent.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.measureContainers);
    window.addEventListener('mouseup', this.deleteMouseMoveEvent);
    window.addEventListener('mouseup', this.deleteOverflowMouseMoveEvent);
    this.measureContainers();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.measureContainers);
    window.removeEventListener('mouseup', this.deleteMouseMoveEvent);
    window.removeEventListener('mouseup', this.deleteOverflowMouseMoveEvent);
  }

  get shouldRenderScrollbar() {
    const overflownRef = this.overflowContainerRef.current;
    const cols = this.props.numCols;

    if (!cols && overflownRef) {
      return overflownRef.clientHeight < overflownRef.scrollHeight;
    }

    return !(overflownRef && overflownRef.children.length <= cols);
  }

  get trackPadding() {
    const {
      trackProps
    } = this.props;
    return trackProps ? C.getPaddingValues(trackProps.padding, trackProps.paddingLeft, trackProps.paddingRight, trackProps.paddingTop, trackProps.paddingBottom) : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
  }

  get contentMargin() {
    const {
      thumbWidth,
      trackWidth
    } = this.state;
    const windowsScrollWidth = 20;
    const marginWidth = trackWidth > thumbWidth ? trackWidth : thumbWidth;
    const margin = isMacOs() ? marginWidth + windowsScrollWidth : marginWidth;
    return !isMobile() && this.shouldRenderScrollbar ? `${margin + 10}px` : '20px';
  }

  get rightOffset() {
    return this.state.thumbWidth > this.state.trackWidth ? (this.state.thumbWidth - this.state.trackWidth) / 2 : 0;
  }

  scrollContainerReducedHeight(scrollContainerHeight) {
    const {
      padding
    } = this.state;
    return scrollContainerHeight - (padding.top + padding.bottom);
  }

  measureContainers() {
    const overflownRef = this.overflowContainerRef.current;
    const thumbRef = this.thumbRef.current;
    const trackRef = this.trackRef.current;
    const areRefsCurrent = C.all(overflownRef, thumbRef, trackRef);

    if (areRefsCurrent) {
      this.setState({
        scrollContainerHeight: this.scrollContainerReducedHeight(overflownRef.clientHeight),
        thumbWidth: thumbRef.offsetWidth,
        trackWidth: trackRef.clientWidth,
        scrollHeight: overflownRef.scrollHeight
      });
    }

    if (areRefsCurrent && thumbRef.offsetTop + thumbRef.offsetHeight > overflownRef.clientHeight) {
      const scrollOffset = overflownRef.clientHeight - thumbRef.offsetHeight;
      overflownRef.scroll(0, overflownRef.scrollHeight);
      thumbRef.style.top = `${scrollOffset}px`;
    }
  }

  onMouseDown(event) {
    event.preventDefault();
    const thumbRef = this.thumbRef.current;
    const overflownRef = this.overflowContainerRef.current;

    if (thumbRef && overflownRef) {
      this.setState({
        deltaYOrigin: thumbRef.offsetTop,
        deltaY: event.clientY + this.state.padding.top
      });
    }

    window.addEventListener('mousemove', this.onMouseDrag);
  }

  onScrollbarClick({
    clientY
  }) {
    const {
      padding
    } = this.state;
    const thumbRef = this.thumbRef.current;
    const overflowRef = this.overflowContainerRef.current;
    const shouldReturn = C.all(thumbRef, overflowRef, clientY >= (C.extractNumberFromStyle(thumbRef.style.top) || 0) + overflowRef.getBoundingClientRect().top + padding.top, clientY <= (C.extractNumberFromStyle(thumbRef.style.top) || 0) + overflowRef.getBoundingClientRect().top + thumbRef.offsetHeight + padding.top); // leave this function if thumb was clicked

    if (shouldReturn) {
      return null;
    }

    const maximumOffset = this.state.scrollContainerHeight - thumbRef.offsetHeight;
    const ratio = (overflowRef.scrollHeight - overflowRef.clientHeight) / maximumOffset;
    const deltaY = overflowRef.getBoundingClientRect().top + thumbRef.offsetHeight / 2 + padding.top;
    return overflowRef.scroll({
      top: ratio * (clientY - deltaY),
      left: 0,
      behavior: 'smooth'
    });
  }

  deleteMouseMoveEvent() {
    window.removeEventListener('mousemove', this.onMouseDrag);
  }

  deleteOverflowMouseMoveEvent() {
    window.removeEventListener('mousemove', this.onOverflowContentDrag);
  }

  onMouseDrag(event) {
    const zero = 0;
    const {
      deltaY,
      deltaYOrigin,
      scrollContainerHeight,
      padding
    } = this.state;
    const overflowRef = this.overflowContainerRef.current;
    const thumbRef = this.thumbRef.current;
    const maximumOffset = scrollContainerHeight - thumbRef.offsetHeight;
    const offset = event.clientY - deltaY + deltaYOrigin + padding.top;
    const isBetweenClientHeight = offset >= zero && offset <= maximumOffset;
    const areRefsCurrent = C.all(Boolean(this.overflowContainerRef.current), Boolean(this.thumbRef.current));

    if (areRefsCurrent && !isBetweenClientHeight) {
      const criticalDimension = offset < zero ? zero : maximumOffset;
      const criticalScrollerDimensions = offset > zero ? overflowRef.scrollHeight - overflowRef.offsetHeight : zero;
      thumbRef.style.top = `${criticalDimension}px`;
      overflowRef.scroll(zero, criticalScrollerDimensions);
    }

    if (areRefsCurrent && isBetweenClientHeight) {
      const ratio = (overflowRef.scrollHeight - overflowRef.offsetHeight) / maximumOffset;
      overflowRef.scroll(zero, ratio * offset);
      thumbRef.style.top = `${offset}px`;
    }
  }

  onOverflowContentScroll() {
    const {
      scrollContainerHeight
    } = this.state;
    const thumbRef = this.thumbRef.current;
    const overflowRef = this.overflowContainerRef.current;

    if (overflowRef && thumbRef) {
      const maximumOffset = scrollContainerHeight - thumbRef.offsetHeight;
      const ratio = maximumOffset / (overflowRef.scrollHeight - overflowRef.clientHeight);
      thumbRef.style.top = `${overflowRef.scrollTop * ratio}px`;
    }
  }

  onOverflowContentMouseDown(event) {
    event.preventDefault();
    const overflowRef = this.overflowContainerRef.current;

    if (overflowRef) {
      this.setState({
        deltaY: event.clientY,
        scrollTop: overflowRef.scrollTop
      });
    }

    window.addEventListener('mousemove', this.onOverflowContentDrag);
  }

  onOverflowContentDrag(event) {
    const {
      deltaY,
      scrollTop
    } = this.state;
    const overflowRef = this.overflowContainerRef.current;

    if (overflowRef && event.clientY !== 0) {
      overflowRef.scroll(0, scrollTop - (event.clientY - deltaY));
    }
  }

  renderThumb() {
    const {
      scrollContainerHeight,
      scrollHeight
    } = this.state;
    const percentageWidth = Number((scrollContainerHeight * 100 / scrollHeight).toFixed(0));
    const height = `${percentageWidth * scrollContainerHeight / 100}px`;

    if (this.props.thumb) {
      return React.cloneElement(this.props.thumb, {
        ref: this.thumbRef,
        onMouseDown: this.onMouseDown,
        style: _objectSpread({
          top: 0,
          position: 'relative',
          cursor: 'pointer'
        }, this.props.thumb.props.style)
      });
    }

    return React.createElement(RectangleThumb, {
      ref: this.thumbRef,
      onMouseDown: this.onMouseDown,
      style: {
        height
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
        right: this.rightOffset,
        display: display ? 'flex' : 'none'
      }, this.props.trackProps)
    }, React.createElement(EmptyAbsolute, null, this.renderThumb()));
  }

  renderChildren() {
    const cols = this.props.numCols;
    const spacing = this.props.spacing;
    const padding = spacing / 2;
    const children = this.props.children;
    return React.Children.map(children, (child, index) => {
      const paddingBottom = index !== React.Children.count(children) - 1 ? `paddingBottom: ${padding}px` : undefined;
      const paddingTop = index !== 0 ? `paddingTop: ${padding}px` : undefined;
      const height = cols ? `calc(100% / ${cols})` : 'auto';
      return React.createElement(ChildrenWrapper, {
        style: {
          padding: `${padding}px 0`,
          height,
          paddingTop,
          paddingBottom,
          marginRight: this.contentMargin
        }
      }, child);
    });
  }

  render() {
    const {
      draggable
    } = this.props;
    const cursor = draggable ? 'pointer' : 'unset';
    return React.createElement(Fragment, null, React.createElement(Content, {
      ref: this.overflowContainerRef,
      onScroll: this.onOverflowContentScroll,
      onLoad: this.measureContainers,
      onMouseDown: draggable ? this.onOverflowContentMouseDown : C.noop,
      style: {
        cursor
      }
    }, this.renderChildren()), this.renderScrollbar());
  }

}
export const Content = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: scroll;
    margin-right: -20px;
    -webkit-overflow-scrolling: touch;
`;
export const ChildrenWrapper = styled.div``;
export const Track = styled.div`
    position: absolute;
    cursor: pointer;
    right: 0;
    height: 100%;
    background-color: ${colors.gray.mediumGray};
    top: 0;
    width: 10px;
    display: flex;
    justify-content: center;
`;
export const RectangleThumb = styled.div`
    position: relative;
    background-color: ${colors.primary};
    cursor: pointer;
    width: 10px;
    height: 100%;
`;
export const EmptyAbsolute = styled.div`
    position: absolute;
`;