import React from 'react';
import { shallow } from 'enzyme';
import { colors } from 'styles';
import { Wrapper, ReactSmartSlider, RectangleThumb, Track, SecondWrapper } from './ReactSmartSlider';
const mockConfig = (device) => ({
    value: device,
    configurable: true
});
const agent = 'userAgent';
const initialProps = {
    numCols: 1,
    spacing: 0,
    trackProps: {
        color: colors.secondary,
        height: 20
    }
};
describe('ReactSmartSlider: lib/components', () => {
    it('should render itself', () => {
        const wrapper = shallow(React.createElement(ReactSmartSlider, Object.assign({}, initialProps)));
        expect(wrapper.find(Wrapper).exists()).toEqual(true);
        expect(wrapper.find(SecondWrapper).exists()).toEqual(true);
        expect(wrapper.find(RectangleThumb).exists()).toEqual(true);
        expect(wrapper.find(Track).exists()).toEqual(true);
    });
    it('should not render Scrollbar', () => {
        Object.defineProperty(window.navigator, agent, mockConfig('iPhone'));
        const wrapper = shallow(React.createElement(ReactSmartSlider, Object.assign({}, initialProps)));
        expect(wrapper.find(Track).exists()).toEqual(false);
        expect(wrapper.find(RectangleThumb).exists()).toEqual(false);
    });
    it('should invoke onOverflowContentScroll onScroll', () => {
        const onOverflowContentScrollSpy = jest.spyOn(ReactSmartSlider.prototype, 'onOverflowContentScroll');
        const wrapper = shallow(React.createElement(ReactSmartSlider, Object.assign({}, initialProps)));
        wrapper.find(SecondWrapper).simulate('scroll');
        expect(onOverflowContentScrollSpy).toHaveBeenCalled();
    });
    it('should invoke measureContainers onLoad', () => {
        const measureContainersSpy = jest.spyOn(ReactSmartSlider.prototype, 'measureContainers');
        const wrapper = shallow(React.createElement(ReactSmartSlider, Object.assign({}, initialProps)));
        wrapper.find(SecondWrapper).simulate('load');
        expect(measureContainersSpy).toHaveBeenCalled();
    });
    it('should invoke addEventListener', () => {
        window.addEventListener = jest.fn();
        shallow(React.createElement(ReactSmartSlider, Object.assign({}, initialProps)));
        expect(window.addEventListener).toHaveBeenCalled();
    });
    it('should invoke removeEventListener', () => {
        window.removeEventListener = jest.fn();
        const wrapper = shallow(React.createElement(ReactSmartSlider, Object.assign({}, initialProps)));
        wrapper.unmount();
        expect(window.removeEventListener).toHaveBeenCalled();
    });
    it('should invoke onMouseDown', () => {
        Object.defineProperty(window.navigator, agent, mockConfig('web'));
        const onMouseDownSpy = jest.spyOn(ReactSmartSlider.prototype, 'onMouseDown');
        const wrapper = shallow(React.createElement(ReactSmartSlider, Object.assign({}, initialProps)));
        const event = {
            preventDefault: jest.fn()
        };
        wrapper.find(RectangleThumb).simulate('mousedown', event);
        expect(onMouseDownSpy).toHaveBeenCalled();
    });
    it('should render CustomScrollbar with props', () => {
        const wrapper = shallow(React.createElement(ReactSmartSlider, Object.assign({}, initialProps)));
        const style = {
            height: '100%'
        };
        expect(wrapper.find(RectangleThumb).props().style).toEqual(style);
    });
    it('should invoke onScrollbarClick after CustomScrollbar clicked', () => {
        ReactSmartSlider.prototype.onScrollbarClick = jest.fn();
        const onScrollbarClickSpy = jest.spyOn(ReactSmartSlider.prototype, 'onScrollbarClick');
        const wrapper = shallow(React.createElement(ReactSmartSlider, Object.assign({}, initialProps)));
        const event = {
            clientX: 123
        };
        wrapper.find(Track).simulate('click', event);
        expect(onScrollbarClickSpy).toHaveBeenCalled();
    });
});
