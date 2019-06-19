import _extends from "@babel/runtime/helpers/extends";
import React from 'react';
import { shallow } from 'enzyme';
import { colors } from "../lib/styles";
import { ReactSmartSliderVertical, RectangleThumb, Track, Content } from "./ReactSmartSliderVertical";

const mockConfig = device => ({
  value: device,
  configurable: true
});

const agent = 'userAgent';

const renderImages = () => {
  const images = ['https://cdn.pixabay.com/photo/2019/06/02/00/46/chapel-4245437__340.jpg', 'https://cdn.pixabay.com/photo/2017/08/22/22/36/cinque-terre-2670762__340.jpg', 'https://cdn.pixabay.com/photo/2016/08/01/20/34/girl-1562091__340.jpg', 'https://cdn.pixabay.com/photo/2013/09/26/23/23/glitter-powder-186829__340.jpg', 'https://cdn.pixabay.com/photo/2019/04/11/09/50/wave-4119274__340.jpg'];
  return images.map(image => React.createElement("img", {
    src: image
  }));
};

const initialProps = {
  numCols: 1,
  spacing: 0,
  trackProps: {
    color: colors.secondary,
    width: 20
  },
  children: renderImages()
};
describe('ReactSmartSliderVertical: lib/components', () => {
  it('should render itself', () => {
    const wrapper = shallow(React.createElement(ReactSmartSliderVertical, initialProps));
    expect(wrapper.find(Content).exists()).toEqual(true);
    expect(wrapper.find(RectangleThumb).exists()).toEqual(true);
    expect(wrapper.find(Track).exists()).toEqual(true);
  });
  it('should not render Scrollbar', () => {
    Object.defineProperty(window.navigator, agent, mockConfig('iPhone'));
    const wrapper = shallow(React.createElement(ReactSmartSliderVertical, initialProps));
    expect(wrapper.find(Track).props().style.display).toEqual('none');
  });
  it('should invoke onOverflowContentScroll onScroll', () => {
    const onOverflowContentScrollSpy = jest.spyOn(ReactSmartSliderVertical.prototype, 'onOverflowContentScroll');
    const wrapper = shallow(React.createElement(ReactSmartSliderVertical, initialProps));
    wrapper.find(Content).simulate('scroll');
    expect(onOverflowContentScrollSpy).toHaveBeenCalled();
  });
  it('should invoke measureContainers onLoad', () => {
    const measureContainersSpy = jest.spyOn(ReactSmartSliderVertical.prototype, 'measureContainers');
    const wrapper = shallow(React.createElement(ReactSmartSliderVertical, initialProps));
    wrapper.find(Content).simulate('load');
    expect(measureContainersSpy).toHaveBeenCalled();
  });
  it('should invoke addEventListener', () => {
    window.addEventListener = jest.fn();
    shallow(React.createElement(ReactSmartSliderVertical, initialProps));
    expect(window.addEventListener).toHaveBeenCalled();
  });
  it('should invoke removeEventListener', () => {
    window.removeEventListener = jest.fn();
    const wrapper = shallow(React.createElement(ReactSmartSliderVertical, initialProps));
    wrapper.unmount();
    expect(window.removeEventListener).toHaveBeenCalled();
  });
  it('should invoke onMouseDown', () => {
    Object.defineProperty(window.navigator, agent, mockConfig('web'));
    const onMouseDownSpy = jest.spyOn(ReactSmartSliderVertical.prototype, 'onMouseDown');
    const wrapper = shallow(React.createElement(ReactSmartSliderVertical, initialProps));
    const event = {
      preventDefault: jest.fn()
    };
    wrapper.find(RectangleThumb).simulate('mousedown', event);
    expect(onMouseDownSpy).toHaveBeenCalled();
  });
  it('should invoke onScrollbarClick after CustomScrollbar clicked', () => {
    ReactSmartSliderVertical.prototype.onScrollbarClick = jest.fn();
    const onScrollbarClickSpy = jest.spyOn(ReactSmartSliderVertical.prototype, 'onScrollbarClick');
    const wrapper = shallow(React.createElement(ReactSmartSliderVertical, initialProps));
    const event = {
      clientX: 123
    };
    wrapper.find(Track).simulate('click', event);
    expect(onScrollbarClickSpy).toHaveBeenCalled();
  });
  it('should set state after measureContainers invoked', () => {
    const wrapper = shallow(React.createElement(ReactSmartSliderVertical, _extends({}, initialProps, {
      numCols: undefined
    })));
    const wrapperInstance = wrapper.instance();

    const getRefCurrent = (refName, refContent) => wrapperInstance[refName].current = refContent;

    const value = 100;
    const documentHeight = 1000;
    const trackWidth = 50;
    getRefCurrent('thumbRef', {
      clientWidth: value,
      clientHeight: value
    });
    getRefCurrent('overflowContainerRef', {
      children: [],
      clientHeight: documentHeight
    });
    getRefCurrent('trackRef', {
      clientWidth: trackWidth
    });
    wrapperInstance.measureContainers();
    expect(wrapper.state().thumbWidth).toEqual(value);
    expect(wrapper.state().thumbHeight).toEqual(value);
    expect(wrapper.state().trackWidth).toEqual(trackWidth);
    expect(wrapper.state().scrollContainerHeight).toEqual(documentHeight);
  });
  it('should change thumbRef after measureContainers invoked', () => {
    const wrapper = shallow(React.createElement(ReactSmartSliderVertical, _extends({}, initialProps, {
      numCols: undefined
    })));
    const wrapperInstance = wrapper.instance();

    const getRefCurrent = (refName, refContent) => wrapperInstance[refName].current = refContent;

    const value = 100;
    const documentHeight = 500;
    const trackWidth = 50;
    const thumbOffsetTop = 800;
    const overflownRef = 'overflowContainerRef';
    const thumbRef = 'thumbRef';
    getRefCurrent('thumbRef', {
      clientWidth: value,
      clientHeight: value,
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
    expect(wrapperInstance[thumbRef].current.style.top).toEqual(`${documentHeight - value}px`);
  });
  it('should change state after onMouseDown', () => {
    const wrapper = shallow(React.createElement(ReactSmartSliderVertical, _extends({}, initialProps, {
      numCols: undefined
    })));
    const wrapperInstance = wrapper.instance();

    const getRefCurrent = (refName, refContent) => wrapperInstance[refName].current = refContent;

    const offsetTop = 50;
    const clientY = 100;
    const onMouseDownEvent = {
      clientY,
      preventDefault: jest.fn()
    };
    getRefCurrent('thumbRef', {
      offsetTop
    });
    wrapper.find(RectangleThumb).simulate('mousedown', onMouseDownEvent);
    expect(wrapper.state().deltaYOrigin).toEqual(offsetTop);
    expect(wrapper.state().deltaY).toEqual(clientY);
  });
  it('should set thumb left style', () => {
    const wrapper = shallow(React.createElement(ReactSmartSliderVertical, _extends({}, initialProps, {
      numCols: undefined
    })));
    const wrapperInstance = wrapper.instance();

    const getRefCurrent = (refName, refContent) => wrapperInstance[refName].current = refContent;

    const clientY = 100;
    const state = {
      deltaY: 50,
      deltaYOrigin: 0,
      scrollContainerHeight: 500,
      thumbWidth: 100
    };
    const thumbRef = 'thumbRef';
    const onMouseDragEvent = {
      clientY
    };
    const offset = clientY - state.deltaY + state.deltaYOrigin;
    wrapper.setState(state);
    getRefCurrent('overflowContainerRef', {
      scroll: jest.fn(),
      getBoundingClientRect: jest.fn(() => ({
        left: 0
      }))
    });
    getRefCurrent('thumbRef', {
      style: {
        left: 0
      },
      clientWidth: 100
    });
    wrapperInstance.onMouseDrag(onMouseDragEvent);
    expect(wrapperInstance[thumbRef].current.style.top).toEqual(`${offset}px`);
    wrapperInstance.onMouseDrag({
      clientY: -clientY
    });
    expect(wrapperInstance[thumbRef].current.style.top).toEqual(`${0}px`);
  });
  it('should set thumb left style when overflownScrollContent scrolled', () => {
    const wrapper = shallow(React.createElement(ReactSmartSliderVertical, _extends({}, initialProps, {
      numCols: undefined,
      trackProps: undefined
    })));
    const wrapperInstance = wrapper.instance();

    const getRefCurrent = (refName, refContent) => wrapperInstance[refName].current = refContent;

    const state = {
      scrollContainerHeight: 500,
      thumbHeight: 100
    };
    const scrollHeight = 1000;
    const clientHeight = 100;
    const scrollTop = 50;
    const thumbRef = 'thumbRef';
    const maximumOffset = state.scrollContainerHeight - state.thumbHeight;
    const ratio = maximumOffset / (scrollHeight - clientHeight);
    getRefCurrent('overflowContainerRef', {
      scrollHeight,
      clientHeight,
      scrollTop,
      children: []
    });
    getRefCurrent('thumbRef', {
      style: {
        top: scrollTop
      }
    });
    wrapper.setState(state);
    wrapperInstance.onOverflowContentScroll();
    expect(wrapperInstance[thumbRef].current.style.top).toEqual(`${scrollTop * ratio}px`);
  });
});