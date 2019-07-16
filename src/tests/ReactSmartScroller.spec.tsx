import React from 'react'
import { shallow } from 'enzyme'
import { ReactSmartScroller, Wrapper } from '../components/ReactSmartScroller'
import { ReactSmartScrollerPagination } from '../components/ReactSmartScrollerPagination'
import { ReactSmartScrollerHorizontal } from '../components/ReactSmartScrollerHorizontal'
import { ReactSmartScrollerVertical } from '../components/ReactSmartScrollerVertical'

const server = require('lib/utils/server')

describe('ReactSmartScroller: lib/components', () => {
    it('should not render', () => {
        server.isServer = true

        const wrapper = shallow(<ReactSmartScroller/>)

        expect(wrapper.find(Wrapper).exists()).toEqual(false)
        expect(wrapper.find(ReactSmartScrollerVertical).exists()).toEqual(false)
        expect(wrapper.find(ReactSmartScrollerPagination).exists()).toEqual(false)
        expect(wrapper.find(ReactSmartScrollerHorizontal).exists()).toEqual(false)
    })

    it('should render ReactSmartScrollerPagination', () => {
        server.isServer = false

        const wrapper = shallow(<ReactSmartScroller pagination/>)

        expect(wrapper.find(Wrapper).exists()).toEqual(true)
        expect(wrapper.find(ReactSmartScrollerPagination).exists()).toEqual(true)
    })

    it('should render ReactSmartScrollerHorizontal', () => {
        server.isServer = false

        const wrapper = shallow(<ReactSmartScroller />)

        expect(wrapper.find(Wrapper).exists()).toEqual(true)
        expect(wrapper.find(ReactSmartScrollerHorizontal).exists()).toEqual(true)
    })

    it('should render ReactSmartScrollerVertical', () => {
        server.isServer = false

        const wrapper = shallow(<ReactSmartScroller vertical/>)

        expect(wrapper.find(Wrapper).exists()).toEqual(true)
        expect(wrapper.find(ReactSmartScrollerVertical).exists()).toEqual(true)
    })
})
