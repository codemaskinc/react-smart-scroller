import React from 'react'
import { shallow } from 'enzyme'
import { ReactSmartScroller, Wrapper } from '../components/ReactSmartScroller'
import { ReactSmartScrollerPagination } from '../components/ReactSmartScrollerPagination'
import { ReactSmartScrollerHorizontal } from '../components/ReactSmartScrollerHorizontal'
import { ReactSmartScrollerVertical } from '../components/ReactSmartScrollerVertical'

const server = require('lib/utils/server')

describe('ReactSmartScroller: lib/components', () => {
    it('should not render', () => {
        jest.spyOn(server, 'isServer')
            .mockImplementation(() => true)

        const wrapper = shallow(<ReactSmartScroller/>)

        expect(wrapper.find(Wrapper).exists()).toEqual(false)
        expect(wrapper.find(ReactSmartScrollerVertical).exists()).toEqual(false)
        expect(wrapper.find(ReactSmartScrollerPagination).exists()).toEqual(false)
        expect(wrapper.find(ReactSmartScrollerHorizontal).exists()).toEqual(false)
    })

    it('should render ReactSmartScrollerPagination', () => {
        jest.spyOn(server, 'isServer')
            .mockImplementation(() => false)

        const wrapper = shallow(<ReactSmartScroller pagination/>)

        expect(wrapper.find(Wrapper).exists()).toEqual(true)
        expect(wrapper.find(ReactSmartScrollerPagination).exists()).toEqual(true)
    })

    it('should render ReactSmartScrollerHorizontal', () => {
        jest.spyOn(server, 'isServer')
            .mockImplementation(() => false)

        const wrapper = shallow(<ReactSmartScroller />)

        expect(wrapper.find(Wrapper).exists()).toEqual(true)
        expect(wrapper.find(ReactSmartScrollerHorizontal).exists()).toEqual(true)
    })

    it('should render ReactSmartScrollerVertical', () => {
        jest.spyOn(server, 'isServer')
            .mockImplementation(() => false)

        const wrapper = shallow(<ReactSmartScroller vertical/>)

        expect(wrapper.find(Wrapper).exists()).toEqual(true)
        expect(wrapper.find(ReactSmartScrollerVertical).exists()).toEqual(true)
    })
})
