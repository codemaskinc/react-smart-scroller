import React from 'react'
import { shallow } from 'enzyme'
import { colors } from 'lib/styles'
import {
    ReactSmartScrollerVertical,
    RectangleThumb,
    Track,
    Content
} from '../components/ReactSmartScrollerVertical'

const mockConfig = (device: string) => ({
    value: device,
    configurable: true
})
const agent = 'userAgent'
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
        width: 20
    },
    children: renderImages()
}

describe('ReactSmartScrollerVertical: lib/components', () => {
    it('should render itself', () => {
        const wrapper = shallow(<ReactSmartScrollerVertical {...initialProps}/>)

        expect(wrapper.find(Content).exists()).toEqual(true)
        expect(wrapper.find(RectangleThumb).exists()).toEqual(true)
        expect(wrapper.find(Track).exists()).toEqual(true)
    })

    it('should not render Scrollbar', () => {
        Object.defineProperty(window.navigator, agent, mockConfig('iPhone'))

        const wrapper = shallow(<ReactSmartScrollerVertical {...initialProps}/>)

        expect(wrapper.find(Track).props().style!.display).toEqual('none')
    })

    it('should invoke onOverflowContentScroll onScroll', () => {
        const onOverflowContentScrollSpy = jest.spyOn(ReactSmartScrollerVertical.prototype, 'onOverflowContentScroll')
        const wrapper = shallow(<ReactSmartScrollerVertical {...initialProps}/>)

        wrapper.find(Content).simulate('scroll')

        expect(onOverflowContentScrollSpy).toHaveBeenCalled()
    })

    it('should invoke addEventListener', () => {
        window.addEventListener = jest.fn()

        shallow(<ReactSmartScrollerVertical {...initialProps}/>)

        expect(window.addEventListener).toHaveBeenCalled()
    })

    it('should invoke removeEventListener', () => {
        window.removeEventListener = jest.fn()

        const wrapper = shallow(<ReactSmartScrollerVertical {...initialProps}/>)

        wrapper.unmount()

        expect(window.removeEventListener).toHaveBeenCalled()
    })

    it('should invoke onMouseDown', () => {
        Object.defineProperty(window.navigator, agent, mockConfig('web'))

        const onMouseDownSpy = jest.spyOn(ReactSmartScrollerVertical.prototype, 'onMouseDown')
        const wrapper = shallow(<ReactSmartScrollerVertical {...initialProps}/>)

        const event = {
            preventDefault: jest.fn()
        }

        wrapper.find(RectangleThumb).simulate('mousedown', event)

        expect(onMouseDownSpy).toHaveBeenCalled()
    })

    it('should set state after measureContainers invoked', () => {
        const wrapper = shallow<ReactSmartScrollerVertical>(
            <ReactSmartScrollerVertical
                {...initialProps}
                numCols={undefined}
            />
        )
        const wrapperInstance = wrapper.instance()
        const getRefCurrent = (refName: string, refContent: {}) => wrapperInstance[refName].current = refContent as HTMLDivElement
        const value = 100
        const documentHeight = 1000
        const trackWidth = 50
        const scrollHeight = 100
        const overflowRef = 'overflowContainerRef'
        const thumbRef = 'thumbRef'
        const trackRef = 'trackRef'

        getRefCurrent(thumbRef , {
            offsetWidth: value,
            offsetHeight: value
        })
        getRefCurrent(overflowRef , {
            children: [],
            clientHeight: documentHeight,
            scroll: jest.fn(),
            scrollHeight
        })
        getRefCurrent(trackRef , {
            clientWidth: trackWidth
        })

        wrapperInstance.measureContainers()

        expect(wrapper.state().thumbWidth).toEqual(value)
        expect(wrapper.state().trackWidth).toEqual(trackWidth)
        expect(wrapper.state().scrollContainerHeight).toEqual(documentHeight)

        getRefCurrent(thumbRef , {
            offsetWidth: value,
            offsetHeight: value,
            offsetTop: documentHeight,
            style: {
                top: 0
            }
        })

        wrapperInstance.measureContainers()

        const scrollCircleTopOffset = documentHeight + value
        const scrollOffset = scrollCircleTopOffset > documentHeight
            ? documentHeight - value
            : documentHeight

        expect(wrapperInstance[overflowRef].current!.scroll).toHaveBeenCalled()
        expect(wrapperInstance[overflowRef].current!.scroll).toHaveBeenCalledWith(0, scrollHeight)
        expect(wrapperInstance[thumbRef].current!.style.top).toEqual(`${scrollOffset}px`)
    })

    it('should change thumbRef after measureContainers invoked', () => {
        const wrapper = shallow<ReactSmartScrollerVertical>(
            <ReactSmartScrollerVertical
                {...initialProps}
                numCols={undefined}
            />
        )
        const wrapperInstance = wrapper.instance()
        const getRefCurrent = (refName: string, refContent: {}) => wrapperInstance[refName].current = refContent as HTMLDivElement
        const value = 100
        const documentHeight = 500
        const trackWidth = 50
        const thumbOffsetTop = 800
        const overflownRef = 'overflowContainerRef'
        const thumbRef = 'thumbRef'

        getRefCurrent('thumbRef' , {
            offsetWidth: value,
            offsetHeight: value,
            offsetTop: thumbOffsetTop,
            style: {
                top: 0
            }
        })
        getRefCurrent(overflownRef , {
            children: [],
            clientHeight: documentHeight,
            scroll: jest.fn()
        })
        getRefCurrent('trackRef' , {
            clientWidth: trackWidth
        })

        wrapperInstance.measureContainers()

        expect(wrapperInstance[thumbRef].current!.style.top).toEqual(`${documentHeight - value}px`)
    })

    it('should change state after onMouseDown', () => {
        const padding = 20
        const wrapper = shallow<ReactSmartScrollerVertical>(
            <ReactSmartScrollerVertical
                {...initialProps}
                numCols={undefined}
                trackProps={{ padding }}
            />
        )
        const wrapperInstance = wrapper.instance()
        const getRefCurrent = (refName: string, refContent: {}) => wrapperInstance[refName].current = refContent as HTMLDivElement
        const offsetTop = 50
        const clientY = 100
        const onMouseDownEvent = {
            clientY,
            preventDefault: jest.fn()
        }

        getRefCurrent('thumbRef' , {
            offsetTop
        })
        getRefCurrent('overflowContainerRef', {
            getBoundingClientRect: jest.fn(() => ({ top: 0 }))
        })

        wrapper.find(RectangleThumb).simulate('mousedown', onMouseDownEvent)

        expect(wrapper.state().deltaYOrigin).toEqual(offsetTop)
        expect(wrapper.state().deltaY).toEqual(clientY + padding)

        wrapper.setProps({
            trackProps: undefined
        })

        wrapper.find(RectangleThumb).simulate('mousedown', onMouseDownEvent)

        expect(wrapper.state().deltaYOrigin).toEqual(offsetTop)
        expect(wrapper.state().deltaY).toEqual(clientY + padding)
    })

    it('should set thumb left style', () => {
        const wrapper = shallow<ReactSmartScrollerVertical>(
            <ReactSmartScrollerVertical
                {...initialProps}
                numCols={undefined}
            />
        )
        const wrapperInstance = wrapper.instance()
        const getRefCurrent = (refName: string, refContent: {}) => wrapperInstance[refName].current = refContent as HTMLDivElement
        const clientY = 100
        const state = {
            deltaY: 50,
            deltaYOrigin: 0,
            scrollContainerHeight: 500,
            thumbWidth: 100
        }
        const thumbRef = 'thumbRef'
        const onMouseDragEvent = {
            clientY
        } as DragEvent
        const offset = clientY - state.deltaY + state.deltaYOrigin

        wrapper.setState(state)

        getRefCurrent('overflowContainerRef' , {
            scroll: jest.fn(),
            getBoundingClientRect: jest.fn(() => ({ left: 0 }))
        })
        getRefCurrent('thumbRef' , {
            style: {
                left: 0
            },
            offsetWidth: 100,
            offsetHeight: 100
        })

        wrapperInstance.onMouseDrag(onMouseDragEvent)

        expect(wrapperInstance[thumbRef].current!.style.top).toEqual(`${offset}px`)

        wrapperInstance.onMouseDrag({ clientY: -clientY } as DragEvent)

        expect(wrapperInstance[thumbRef].current!.style.top).toEqual(`${0}px`)
    })

    it('should set thumb critical dimensions after mouseDrag', () => {
        const wrapper = shallow<ReactSmartScrollerVertical>(
            <ReactSmartScrollerVertical
                {...initialProps}
                numCols={undefined}
            />
        )
        const wrapperInstance = wrapper.instance()
        const getRefCurrent = (refName: string, refContent: {}) => wrapperInstance[refName].current = refContent as HTMLDivElement
        const clientY = -100
        const state = {
            deltaY: 50,
            deltaYOrigin: 0,
            scrollContainerHeight: 500,
            thumbWidth: 100
        }
        const thumbRef = 'thumbRef'
        const overflownRef = 'overflowContainerRef'
        const onMouseDragEvent = {
            clientY
        } as DragEvent
        const offset = clientY - state.deltaY + state.deltaYOrigin
        const maximumOffset = state.scrollContainerHeight - 100
        const criticalDimension = offset < 0 ? 0 : maximumOffset
        const criticalScrollerDimensions = offset > 0
            ? 1500 - state.scrollContainerHeight
            : 0

        wrapper.setState(state)

        getRefCurrent(overflownRef , {
            scroll: jest.fn(),
            getBoundingClientRect: jest.fn(() => ({ top: 0 })),
            scrollHeight: 1500,
            offsetHeight: state.scrollContainerHeight
        })
        getRefCurrent(thumbRef , {
            style: {
                left: 0
            },
            offsetWidth: 100,
            offsetHeight: 100
        })

        wrapperInstance.onMouseDrag(onMouseDragEvent)

        expect(wrapperInstance[thumbRef].current!.style.top).toEqual(`${criticalDimension}px`)

        wrapperInstance.onMouseDrag({ clientY } as DragEvent)

        expect(wrapperInstance[thumbRef].current!.style.top).toEqual(`${0}px`)
        expect(wrapperInstance[overflownRef].current!.scroll).toHaveBeenCalled()
        expect(wrapperInstance[overflownRef].current!.scroll).toHaveBeenCalledWith(0, criticalScrollerDimensions)

        wrapperInstance.onMouseDrag({ clientY: 1000000 } as DragEvent)

        expect(wrapperInstance[thumbRef].current!.style.top).toEqual(`${maximumOffset}px`)
        expect(wrapperInstance[overflownRef].current!.scroll).toHaveBeenCalled()
        expect(wrapperInstance[overflownRef].current!.scroll).toHaveBeenCalledWith(0, criticalScrollerDimensions)
    })

    it('should set thumb left style when overflownScrollContent scrolled', () => {
        const wrapper = shallow<ReactSmartScrollerVertical>(
            <ReactSmartScrollerVertical
                {...initialProps}
                numCols={undefined}
                trackProps={undefined}
            />
        )
        const wrapperInstance = wrapper.instance()
        const getRefCurrent = (refName: string, refContent: {}) => wrapperInstance[refName].current = refContent as HTMLDivElement
        const state = {
            scrollContainerHeight: 500
        }
        const thumbHeight = 100
        const scrollHeight = 1000
        const clientHeight = 100
        const scrollTop = 50
        const thumbRef = 'thumbRef'

        getRefCurrent('overflowContainerRef' , {
            scrollHeight,
            clientHeight,
            scrollTop,
            children: []
        })
        getRefCurrent('thumbRef' , {
            style: {
                top: scrollTop
            },
            offsetHeight: thumbHeight
        })

        wrapper.setState(state)

        wrapperInstance.onOverflowContentScroll()

        expect(wrapperInstance[thumbRef].current!.style.top).toEqual(`${scrollTop * wrapperInstance.state.ratio}px`)
    })

    it('should render custom thumb if provided', () => {
        React.cloneElement = jest.fn()

        shallow<ReactSmartScrollerVertical>(
            <ReactSmartScrollerVertical
                {...initialProps}
                numCols={undefined}
                thumb={
                    <div
                        style={{
                            width: 20,
                            height: 20
                        }}
                    />
                }
            />
        )

        expect(React.cloneElement).toHaveBeenCalled()
    })

    it('should remove mousemove event', () => {
        window.removeEventListener = jest.fn()

        const wrapper = shallow<ReactSmartScrollerVertical>(<ReactSmartScrollerVertical/>)
        const wrapperInstance = wrapper.instance()

        wrapperInstance.deleteMouseMoveEvent()

        expect(window.removeEventListener).toHaveBeenCalled()
    })

    it('should invoke scroll on overflownRef', () => {
        const wrapper = shallow<ReactSmartScrollerVertical>(<ReactSmartScrollerVertical {...initialProps}/>)
        const wrapperInstance = wrapper.instance()
        const getRefCurrent = (refName: string, refContent: {}) => wrapperInstance[refName].current = refContent as HTMLDivElement
        const state = {
            deltaY: 50,
            deltaYOrigin: 0,
            scrollContainerHeight: 500
        }
        const thumbRef = 'thumbRef'
        const overflowContainerRef = 'overflowContainerRef'
        const event = {
            clientY: 123
        } as React.MouseEvent

        wrapper.setState(state)

        getRefCurrent(overflowContainerRef , {
            scroll: jest.fn(),
            getBoundingClientRect: jest.fn(() => ({ top: 0 }))
        })
        getRefCurrent(thumbRef , {
            style: {
                top: 0
            },
            offsetHeight: 100,
            offsetTop: 0
        })

        wrapperInstance.onScrollbarClick(event)

        expect(wrapperInstance[overflowContainerRef].current!.scroll).toHaveBeenCalled()
    })

    it('should return null if thumbClicked on onScrollbarClick response', () => {
        const wrapper = shallow<ReactSmartScrollerVertical>(<ReactSmartScrollerVertical {...initialProps}/>)
        const wrapperInstance = wrapper.instance()
        const getRefCurrent = (refName: string, refContent: {}) => wrapperInstance[refName].current = refContent as HTMLDivElement
        const state = {
            deltaY: 50,
            deltaYOrigin: 0,
            scrollContainerHeight: 500
        }
        const thumbRef = 'thumbRef'
        const overflowContainerRef = 'overflowContainerRef'
        const event = {
            clientY: 0
        } as React.MouseEvent

        wrapper.setState(state)

        getRefCurrent(overflowContainerRef , {
            scroll: jest.fn(),
            getBoundingClientRect: jest.fn(() => ({ top: 0 }))
        })
        getRefCurrent(thumbRef , {
            style: {
                top: 0
            },
            offsetHeight: 100,
            offsetTop: 0
        })

        wrapperInstance.onScrollbarClick(event)

        expect(wrapperInstance[overflowContainerRef].current!.scroll).not.toHaveBeenCalled()
    })

    it('should return not changed scrollContainerWidth', () => {
        const wrapper = shallow<ReactSmartScrollerVertical>(
            <ReactSmartScrollerVertical
                {...initialProps}
                trackProps={undefined}
            />
        )
        const wrapperInstance = wrapper.instance()
        const containerHeight = 100
        const padding = 20

        expect(wrapperInstance.scrollContainerReducedHeight(containerHeight)).toEqual(containerHeight)

        wrapper.setState({
            padding: {
                top: padding,
                right: padding,
                bottom: padding,
                left: padding
            }
        })

        expect(wrapperInstance.scrollContainerReducedHeight(containerHeight)).toEqual(containerHeight - 2 * padding)
    })

    it('should invoke scroll after content dragged', () => {
        const wrapper = shallow<ReactSmartScrollerVertical>(<ReactSmartScrollerVertical {...initialProps}/>)
        const wrapperInstance = wrapper.instance()
        const getRefCurrent = (refName: string, refContent: {}) => wrapperInstance[refName].current = refContent as HTMLDivElement
        const state = {
            deltaY: 50
        }
        const overflowContainerRef = 'overflowContainerRef'
        const event = {
            clientY: 123
        } as MouseEvent

        wrapper.setState(state)

        getRefCurrent(overflowContainerRef , {
            scroll: jest.fn()
        })

        wrapperInstance.onOverflowContentDrag(event)

        expect(wrapperInstance[overflowContainerRef].current!.scroll).toHaveBeenCalled()
    })

    it('should not invoke scroll after content dragged', () => {
        const wrapper = shallow<ReactSmartScrollerVertical>(<ReactSmartScrollerVertical {...initialProps}/>)
        const wrapperInstance = wrapper.instance()
        const getRefCurrent = (refName: string, refContent: {}) => wrapperInstance[refName].current = refContent as HTMLDivElement
        const state = {
            deltaY: 50
        }
        const overflowContainerRef = 'overflowContainerRef'
        const event = {
            clientY: 0
        } as MouseEvent

        wrapper.setState(state)

        getRefCurrent(overflowContainerRef , {
            scroll: jest.fn()
        })

        wrapperInstance.onOverflowContentDrag(event)

        expect(wrapperInstance[overflowContainerRef].current!.scroll).not.toHaveBeenCalled()
    })

    it('should invoke event listener and setState after onOverflowContentMouseDown', () => {
        window.addEventListener = jest.fn()

        const wrapper = shallow<ReactSmartScrollerVertical>(
            <ReactSmartScrollerVertical
                {...initialProps}
                draggable
            />
        )
        const wrapperInstance = wrapper.instance()
        const getRefCurrent = (refName: string, refContent: {}) => wrapperInstance[refName].current = refContent as HTMLDivElement
        const overflowContainerRef = 'overflowContainerRef'
        const state = {
            deltaY: 123,
            scrollTop: 0
        }
        const event = {
            clientY: state.deltaY,
            preventDefault: jest.fn()
        }

        getRefCurrent(overflowContainerRef , {
            scrollTop: state.scrollTop,
            children: []
        })

        wrapper.find(Content).simulate('mousedown', event)

        expect(window.addEventListener).toHaveBeenCalled()
        expect(wrapper.state().deltaY).toEqual(state.deltaY)
        expect(wrapper.state().scrollTop).toEqual(state.scrollTop)
    })

    it('should invoke removeEventListener after deleteOverflowMouseMoveEvent', () => {
        window.removeEventListener = jest.fn()

        const wrapper = shallow<ReactSmartScrollerVertical>(<ReactSmartScrollerVertical{...initialProps}/>)
        const wrapperInstance = wrapper.instance()

        wrapperInstance.deleteOverflowMouseMoveEvent()

        expect(window.removeEventListener).toHaveBeenCalled()
    })

    it('should not set state after onOverflowContentMouseDown invoked', () => {
        const wrapper = shallow<ReactSmartScrollerVertical>(
            <ReactSmartScrollerVertical
                {...initialProps}
                draggable
            />
        )
        const state = {
            deltaY: 0,
            scrollTop: 0
        }
        const event = {
            clientY: state.deltaY,
            preventDefault: jest.fn()
        }

        wrapper.find(Content).simulate('mousedown', event)

        expect(wrapper.state().deltaY).toEqual(state.deltaY)
        expect(wrapper.state().scrollTop).toEqual(state.scrollTop)
    })

    it('should return margin after contentMargin invoked', () => {
        const wrapper = shallow<ReactSmartScrollerVertical>(<ReactSmartScrollerVertical {...initialProps}/>)
        const wrapperInstance = wrapper.instance()
        const state = {
            thumbWidth: 20,
            trackWidth: 100
        }
        const windowsScrollWidth = 20

        wrapper.setState(state)

        expect(wrapperInstance.contentMargin).toEqual(`${state.trackWidth + 10}px`)

        wrapper.setState({
            thumbWidth: 200
        })

        expect(wrapperInstance.contentMargin).toEqual(`${200 + 10}px`)

        Object.defineProperty(window.navigator, agent, mockConfig('Mac'))

        expect(wrapperInstance.contentMargin).toEqual(`${200 + windowsScrollWidth + 10}px`)
    })

    it('should invoke onScrollbarClick after CustomScrollbar clicked', () => {
        ReactSmartScrollerVertical.prototype.onScrollbarClick = jest.fn()

        const onScrollbarClickSpy = jest.spyOn(ReactSmartScrollerVertical.prototype, 'onScrollbarClick')
        const wrapper = shallow(<ReactSmartScrollerVertical {...initialProps}/>)
        const event = {
            clientY: 123
        } as React.MouseEvent

        wrapper.find(Track).simulate('click', event)

        expect(onScrollbarClickSpy).toHaveBeenCalled()
    })
})
