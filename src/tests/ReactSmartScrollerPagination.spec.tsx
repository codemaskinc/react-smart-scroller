import React from 'react'
import { shallow } from 'enzyme'
import { colors } from 'lib/styles'
import {
    Dot,
    ReactSmartScrollerPagination,
    Container,
    ContainerWrapper,
    LeftArrow,
    Pagination,
    RightArrow,
    ChildrenWrapper
} from '../components/ReactSmartScrollerPagination'

const isMobile = require('lib/utils/deviceDetect')
const renderImages = () => {
    const images = [
        'https://cdn.pixabay.com/photo/2019/06/02/00/46/chapel-4245437__340.jpg',
        'https://cdn.pixabay.com/photo/2017/08/22/22/36/cinque-terre-2670762__340.jpg',
        'https://cdn.pixabay.com/photo/2016/08/01/20/34/girl-1562091__340.jpg',
        'https://cdn.pixabay.com/photo/2013/09/26/23/23/glitter-powder-186829__340.jpg',
        'https://cdn.pixabay.com/photo/2019/04/11/09/50/wave-4119274__340.jpg'
    ]

    return images.map(image => (
        <img src={image}/>
    ))
}
const initialProps = {
    numCols: 1,
    spacing: 0,
    trackProps: {
        color: colors.secondary,
        height: 20
    },
    pagination: true,
    children: renderImages()
}

describe('ReactSmartScrollerPagination: lib/components', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should render itself', () => {
        const wrapper = shallow(<ReactSmartScrollerPagination {...initialProps}/>)

        expect(wrapper.find(ContainerWrapper).exists()).toEqual(true)
        expect(wrapper.find(Container).exists()).toEqual(true)
        expect(wrapper.find(Pagination).exists()).toEqual(true)
        expect(wrapper.find(LeftArrow).exists()).toEqual(true)
        expect(wrapper.find(RightArrow).exists()).toEqual(true)
        expect(wrapper.find(Dot)).toHaveLength(5)
    })

    it('should return length of children', () => {
        const wrapper = shallow<ReactSmartScrollerPagination>(<ReactSmartScrollerPagination {...initialProps}/>)

        expect(wrapper.instance().childrenCount).toEqual(5)
    })

    it('should return number of Views', () => {
        const wrapper = shallow<ReactSmartScrollerPagination>(<ReactSmartScrollerPagination {...initialProps}/>)
        const numViews = 5

        expect(wrapper.instance().numberOfViews).toEqual(numViews)
    })

    it('should invoke onNext', () => {
        const onNextSpy = jest.spyOn(ReactSmartScrollerPagination.prototype, 'onNext')
        const wrapper = shallow<ReactSmartScrollerPagination>(<ReactSmartScrollerPagination {...initialProps}/>)

        wrapper.find(RightArrow).simulate('click')

        expect(onNextSpy).toHaveBeenCalled()
    })

    it('should change slide to first after onNext invoked', () => {
        const wrapper = shallow<ReactSmartScrollerPagination>(
            <ReactSmartScrollerPagination
                {...initialProps}
                paginationConfig={{
                    infinite: true
                }}
            />
        )
        const getRefCurrent = (refName: string, refContent: {}) => wrapper.instance()[refName].current = refContent as HTMLDivElement

        getRefCurrent('overflowContainerRef' , {
            style: {}
        })
        wrapper.setState({
            paginationIndex: 4,
            scrollValue: 400
        })
        wrapper.instance().onNext()

        expect(wrapper.state().paginationIndex).toEqual(0)
        expect(wrapper.state().scrollValue).toEqual(0)
    })

    it('should change slide to next after onNext invoked', () => {
        const wrapper = shallow<ReactSmartScrollerPagination>(<ReactSmartScrollerPagination{...initialProps}/>)
        const getRefCurrent = (refName: string, refContent: {}) => wrapper.instance()[refName].current = refContent as HTMLDivElement
        const refProps = {
            offsetWidth: 400,
            scrollWidth: 2000
        }
        const scrollValue = 1000
        const paginationIndex = 1

        getRefCurrent('overflowContainerRef' , {
            style: {},
            ...refProps
        })
        wrapper.setState({
            paginationIndex,
            scrollValue
        })
        wrapper.instance().onNext()

        const newScrollValue = scrollValue - refProps.offsetWidth

        expect(wrapper.state().paginationIndex).toEqual(2)
        expect(wrapper.state().scrollValue).toEqual(newScrollValue)
    })

    it('should change slide to last after onPrevious invoked', () => {
        const wrapper = shallow<ReactSmartScrollerPagination>(
            <ReactSmartScrollerPagination
                {...initialProps}
                paginationConfig={{
                    infinite: true
                }}
            />
        )
        const getRefCurrent = (refName: string, refContent: {}) => wrapper.instance()[refName].current = refContent as HTMLDivElement

        getRefCurrent('overflowContainerRef' , {
            style: {},
            offsetWidth: 400
        })
        wrapper.setState({
            paginationIndex: 0,
            scrollValue: 400
        })
        wrapper.instance().onPrevious()

        expect(wrapper.state().paginationIndex).toEqual(4)
        expect(wrapper.state().scrollValue).toEqual(-4 * 400)
    })

    it('should change slide to previous after onPrevious invoked', () => {
        const wrapper = shallow<ReactSmartScrollerPagination>(
            <ReactSmartScrollerPagination
                {...initialProps}
                paginationConfig={{
                    infinite: true
                }}
            />
        )
        const getRefCurrent = (refName: string, refContent: {}) => wrapper.instance()[refName].current = refContent as HTMLDivElement
        const refProps = {
            offsetWidth: 400,
            scrollWidth: 2000
        }
        const scrollValue = 1000
        const paginationIndex = 1

        getRefCurrent('overflowContainerRef' , {
            style: {},
            ...refProps
        })
        wrapper.setState({
            paginationIndex,
            scrollValue
        })
        wrapper.instance().onPrevious()

        const index = paginationIndex - 1
        const newScrollValue = scrollValue + refProps.offsetWidth

        expect(wrapper.state().paginationIndex).toEqual(index)
        expect(wrapper.state().scrollValue).toEqual(newScrollValue)
    })

    it('should not change state when onPrevious invoked and overflowContainerRef doesnt exists', () => {
        const wrapper = shallow<ReactSmartScrollerPagination>(<ReactSmartScrollerPagination{...initialProps}/>)

        wrapper.instance().onPrevious()

        expect(wrapper.state().paginationIndex).toEqual(0)
        expect(wrapper.state().scrollValue).toEqual(0)
    })

    it('should invoke onDotClick', () => {
        const onDotClickSpy = jest.spyOn(ReactSmartScrollerPagination.prototype, 'onDotClick')
        const wrapper = shallow<ReactSmartScrollerPagination>(<ReactSmartScrollerPagination {...initialProps}/>)

        wrapper.find(Dot).at(0).simulate('click')

        expect(onDotClickSpy).toHaveBeenCalled()
        expect(onDotClickSpy).toHaveBeenCalledWith(0)
        expect(wrapper.state().paginationIndex).toEqual(0)
        expect(wrapper.state().scrollValue).toEqual(0)
    })

    it('should invoke onDotClick and change state', () => {
        const onDotClickSpy = jest.spyOn(ReactSmartScrollerPagination.prototype, 'onDotClick')
        const wrapper = shallow<ReactSmartScrollerPagination>(<ReactSmartScrollerPagination {...initialProps}/>)
        const getRefCurrent = (refName: string, refContent: {}) => wrapper.instance()[refName].current = refContent as HTMLDivElement
        const refProps = {
            clientWidth: 400
        }
        getRefCurrent('overflowContainerRef' , {
            style: {},
            ...refProps
        })

        wrapper.find(Dot).at(1).simulate('click')

        expect(onDotClickSpy).toHaveBeenCalled()
        expect(onDotClickSpy).toHaveBeenCalledWith(1)
        expect(wrapper.state().paginationIndex).toEqual(1)
        expect(wrapper.state().scrollValue).toEqual(-refProps.clientWidth)
    })

    it('should invoke onOverflowContentMouseDown', () => {
        const onOverflowContentMouseDownSpy = jest.spyOn(ReactSmartScrollerPagination.prototype, 'onOverflowContentMouseDown')
        const wrapper = shallow<ReactSmartScrollerPagination>(<ReactSmartScrollerPagination {...initialProps}/>)
        const event = {
            preventDefault: jest.fn()
        }

        wrapper.find(Container).simulate('mousedown', event)

        expect(onOverflowContentMouseDownSpy).toHaveBeenCalled()
    })

    it('should not invoke onOverflowContentMouseDown if mobile', () => {
        jest.spyOn(isMobile, 'isMobile')
            .mockImplementation(() => true)

        const onOverflowContentMouseDownSpy = jest.spyOn(ReactSmartScrollerPagination.prototype, 'onOverflowContentMouseDown')
        const wrapper = shallow<ReactSmartScrollerPagination>(<ReactSmartScrollerPagination {...initialProps}/>)
        const event = {
            preventDefault: jest.fn()
        }

        wrapper.find(Container).simulate('mousedown', event)

        expect(onOverflowContentMouseDownSpy).not.toHaveBeenCalled()
    })

    it('should set state after onOverflowContentMouseDown', () => {
        window.addEventListener = jest.fn()
        jest.spyOn(isMobile, 'isMobile')
            .mockImplementation(() => false)

        const wrapper = shallow<ReactSmartScrollerPagination>(
            <ReactSmartScrollerPagination
                {...initialProps}
                paginationConfig={{
                    draggable: true
                }}
            />
        )
        const getRefCurrent = (refName: string, refContent: {}) => wrapper.instance()[refName].current = refContent as HTMLDivElement
        const refProps = {
            clientWidth: 400
        }
        const event = {
            preventDefault: jest.fn(),
            clientX: 200
        }

        getRefCurrent('overflowContainerRef' , {
            style: {},
            ...refProps
        })

        wrapper.find(Container).simulate('mousedown', event)

        expect(wrapper.state().deltaX).toEqual(200)
        expect(wrapper.state().scrollLeft).toEqual(0)
        expect(wrapper.state().dragScroll).toEqual(0)
        expect(window.addEventListener).toHaveBeenCalled()
    })

    it('should invoke onOverflowContentDrag and change state', () => {
        const wrapper = shallow<ReactSmartScrollerPagination>(
            <ReactSmartScrollerPagination
                {...initialProps}
                paginationConfig={{
                    draggable: true
                }}
            />
        )
        const getRefCurrent = (refName: string, refContent: {}) => wrapper.instance()[refName].current = refContent as HTMLDivElement
        const refProps = {
            clientWidth: 400
        }
        const mouseDownEvent = {
            preventDefault: jest.fn(),
            clientX: 0
        }
        const mouseMoveEvent = {
            clientX: 0
        } as MouseEvent

        wrapper.find(Container).simulate('mousedown', mouseDownEvent)
        wrapper.instance().onOverflowContentDrag(mouseMoveEvent)

        expect(wrapper.state().dragScroll).toEqual(0)

        getRefCurrent('overflowContainerRef', {
            style: {},
            ...refProps
        })

        const secondMouseMoveEvent = {
            clientX: 100
        } as MouseEvent
        const dragScroll = secondMouseMoveEvent.clientX - mouseDownEvent.clientX

        wrapper.instance().onOverflowContentDrag(secondMouseMoveEvent)

        expect(wrapper.state().dragScroll).toEqual(dragScroll)
    })

    it('should invoke deleteOverflowMouseMoveEvent and change slide to next', () => {
        const wrapper = shallow<ReactSmartScrollerPagination>(
            <ReactSmartScrollerPagination
                {...initialProps}
                paginationConfig={{
                    draggable: true
                }}
            />
        )
        const getRefCurrent = (refName: string, refContent: {}) => wrapper.instance()[refName].current = refContent as HTMLDivElement
        const refProps = {
            clientWidth: 400
        }
        const paginationIndex = 0

        getRefCurrent('overflowContainerRef' , {
            style: {},
            ...refProps
        })

        wrapper.setState({
            dragScroll: -200,
            paginationIndex
        })

        wrapper.instance().deleteOverflowMouseMoveEvent()

        const isLastSlide = false
        const newValue = isLastSlide
            ? paginationIndex * refProps.clientWidth
            : (paginationIndex + 1) * refProps.clientWidth

        expect(wrapper.state().paginationIndex).toEqual(1)
        expect(wrapper.state().scrollValue).toEqual(-newValue)

        wrapper.setState({
            paginationIndex: 4
        })

        wrapper.instance().deleteOverflowMouseMoveEvent()

        expect(wrapper.state().paginationIndex).toEqual(4)
        expect(wrapper.state().scrollValue).toEqual(-4 * 400)
    })

    it('should invoke deleteOverflowMouseMoveEvent and change slide to previous', () => {
        const wrapper = shallow<ReactSmartScrollerPagination>(
            <ReactSmartScrollerPagination
                {...initialProps}
                paginationConfig={{
                    draggable: true
                }}
            />
        )
        const getRefCurrent = (refName: string, refContent: {}) => wrapper.instance()[refName].current = refContent as HTMLDivElement
        const refProps = {
            clientWidth: 400
        }
        const paginationIndex = 1

        getRefCurrent('overflowContainerRef' , {
            style: {},
            ...refProps
        })

        wrapper.setState({
            dragScroll: 200,
            paginationIndex
        })

        wrapper.instance().deleteOverflowMouseMoveEvent()

        const isFirstSlide = false
        const newValue = !isFirstSlide
            ? (paginationIndex - 1) * refProps.clientWidth
            : 0

        expect(wrapper.state().paginationIndex).toEqual(0)
        expect(wrapper.state().scrollValue).toEqual(-newValue)

        wrapper.setState({
            paginationIndex: 0
        })

        wrapper.instance().deleteOverflowMouseMoveEvent()

        expect(wrapper.state().paginationIndex).toEqual(0)
        expect(wrapper.state().scrollValue).toEqual(-newValue)
    })

    it('should render custom pagination', () => {
        const wrapper = shallow<ReactSmartScrollerPagination>(
            <ReactSmartScrollerPagination
                {...initialProps}
                renderPagination={() => (
                    <div>
                        <div>Left</div>
                        <div>dot</div>
                        <div>dot</div>
                        <div>dot</div>
                        <div>Right</div>
                    </div>
                )}
            />
        )

        expect(wrapper.find(Pagination).exists()).toEqual(false)
    })

    it('should return init transition after deleteOverflowMouseMoveEvent invoked', () => {
        const wrapper = shallow<ReactSmartScrollerPagination>(
            <ReactSmartScrollerPagination
                {...initialProps}
                paginationConfig={{
                    draggable: true
                }}
            />
        )
        const getRefCurrent = (refName: string, refContent: {}) => wrapper.instance()[refName].current = refContent as HTMLDivElement
        const overflowContainerRef = 'overflowContainerRef'

        getRefCurrent(overflowContainerRef , {
            style: {},
            clientWidth: 200
        })

        wrapper.setState({
            dragScroll: 50,
            scrollLeft: 0
        })

        wrapper.instance().deleteOverflowMouseMoveEvent()

        expect(wrapper.instance()[overflowContainerRef].current!.style.transition).toEqual('all 1s')
        expect(wrapper.instance()[overflowContainerRef].current!.style.transform).toEqual('translate(-0px)')
    })

    it('should change state after onTouchstart invoked', () => {
        const wrapper = shallow<ReactSmartScrollerPagination>(<ReactSmartScrollerPagination {...initialProps}/>)
        const touchEvent = {
            touches: {
                length: 1,
                item: jest.fn(() => ({
                    clientX: 100,
                    clientY: 100
                }) as Touch)
            } as TouchList
        } as TouchEvent
        const getRefCurrent = (refName: string, refContent: {}) => wrapper.instance()[refName].current = refContent as HTMLDivElement
        const overflowContainerRef = 'overflowContainerRef'

        wrapper.instance().onTouchStart(touchEvent)

        expect(wrapper.state().deltaX).toEqual(100)
        expect(wrapper.state().deltaY).toEqual(100)
        expect(wrapper.state().scrollLeft).toEqual(0)
        expect(wrapper.state().dragScroll).toEqual(0)
        expect(wrapper.state().horizontal).toEqual(false)
        expect(wrapper.state().lockedMove).toEqual(false)

        getRefCurrent(overflowContainerRef , {
            style: {
                transition: 'all 1s'
            }
        })

        wrapper.instance().onTouchStart(touchEvent)

        expect(wrapper.instance()[overflowContainerRef].current!.style.transition).toEqual('unset')
    })

    it('should return null when onTouchMove invoked', () => {
        const wrapper = shallow<ReactSmartScrollerPagination>(
            <ReactSmartScrollerPagination
                {...initialProps}
                paginationConfig={{
                    minOffsetToChangeSlide: 50
                }}
            />
        )
        const getRefCurrent = (refName: string, refContent: {}) => wrapper.instance()[refName].current = refContent as HTMLDivElement
        const overflowContainerRef = 'overflowContainerRef'
        const touchEvent = {
            touches: {
                length: 1,
                item: jest.fn(() => ({
                    clientX: 0,
                    clientY: 100,
                    target: {
                        addEventListener: jest.fn(),
                        dispatchEvent: jest.fn(),
                        removeEventListener: jest.fn(),
                        parentNode: {
                            parentNode: wrapper.instance()[overflowContainerRef].current
                        }
                    } as EventTarget
                }) as Touch)
            } as TouchList,
            preventDefault(): void {}
        } as TouchEvent

        getRefCurrent(overflowContainerRef , {
            style: {}
        })

        wrapper.setState({
            horizontal: false,
            lockedMove: true
        })

        expect(wrapper.instance().onTouchMove(touchEvent)).toEqual(null)

        wrapper.setState({
            horizontal: false,
            lockedMove: false,
            deltaY: 20
        })

        wrapper.instance().onTouchMove(touchEvent)

        expect(wrapper.state().horizontal).toEqual(false)
        expect(wrapper.state().lockedMove).toEqual(true)
    })

    it('should change state after onTouchMove invoked with horizontal move', () => {
        const preventDefault: () => void = jest.fn()
        const wrapper = shallow<ReactSmartScrollerPagination>(<ReactSmartScrollerPagination {...initialProps}/>)
        const getRefCurrent = (refName: string, refContent: {}) => wrapper.instance()[refName].current = refContent as HTMLDivElement
        const overflowContainerRef = 'overflowContainerRef'
        const touchEvent = {
            touches: {
                length: 1,
                item: jest.fn(() => ({
                    clientX: 100,
                    clientY: 0,
                    target: {
                        addEventListener: jest.fn(),
                        dispatchEvent: jest.fn(),
                        removeEventListener: jest.fn(),
                        parentNode: {
                            parentNode: wrapper.instance()[overflowContainerRef].current
                        }
                    } as EventTarget
                }) as Touch)
            } as TouchList,
            preventDefault
        } as TouchEvent
        const dragScroll = 80

        getRefCurrent(overflowContainerRef , {
            style: {}
        })

        wrapper.setState({
            horizontal: false,
            lockedMove: false,
            deltaX: 20
        })

        wrapper.instance().onTouchMove(touchEvent)

        expect(wrapper.state().horizontal).toEqual(true)
        expect(wrapper.state().lockedMove).toEqual(true)
        expect(preventDefault).toHaveBeenCalled()
        expect(wrapper.state().dragScroll).toEqual(dragScroll)
    })

    it('should invoke eventListeners', () => {
        window.removeEventListener = jest.fn()

        const wrapper = shallow<ReactSmartScrollerPagination>(<ReactSmartScrollerPagination {...initialProps}/>)

        wrapper.unmount()

        expect(window.removeEventListener).toHaveBeenCalled()
    })

    it('should render children with flexBasis unset', () => {
        const wrapper = shallow<ReactSmartScrollerPagination>(
            <ReactSmartScrollerPagination
                {...initialProps}
                numCols={undefined}
            />
        )

        expect(wrapper.find(ChildrenWrapper).at(0).props().style!.flexBasis).toEqual('unset')
    })
})
