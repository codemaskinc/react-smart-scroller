import React from 'react'
import { shallow } from 'enzyme'
import { colors } from 'lib/styles'
import {
    ReactSmartScrollerHorizontal,
    RectangleThumb,
    Track,
    SecondWrapper
} from '../components/ReactSmartScrollerHorizontal'

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
        height: 20
    },
    children: renderImages()
}

describe('ReactSmartScrollerHorizontal: lib/components', () => {
    it('should render itself', () => {
        const wrapper = shallow(<ReactSmartScrollerHorizontal {...initialProps}/>)

        expect(wrapper.find(SecondWrapper).exists()).toEqual(true)
        expect(wrapper.find(RectangleThumb).exists()).toEqual(true)
        expect(wrapper.find(Track).exists()).toEqual(true)
    })

    it('should not render Scrollbar', () => {
        Object.defineProperty(window.navigator, agent, mockConfig('iPhone'))

        const wrapper = shallow(<ReactSmartScrollerHorizontal {...initialProps}/>)

        expect(wrapper.find(Track).props().style!.display).toEqual('none')
    })

    it('should invoke onOverflowContentScroll onScroll', () => {
        const onOverflowContentScrollSpy = jest.spyOn(ReactSmartScrollerHorizontal.prototype, 'onOverflowContentScroll')
        const wrapper = shallow(<ReactSmartScrollerHorizontal {...initialProps}/>)

        wrapper.find(SecondWrapper).simulate('scroll')

        expect(onOverflowContentScrollSpy).toHaveBeenCalled()
    })

    it('should invoke addEventListener', () => {
        window.addEventListener = jest.fn()

        shallow(<ReactSmartScrollerHorizontal {...initialProps}/>)

        expect(window.addEventListener).toHaveBeenCalled()
    })

    it('should invoke removeEventListener', () => {
        window.removeEventListener = jest.fn()

        const wrapper = shallow(<ReactSmartScrollerHorizontal {...initialProps}/>)

        wrapper.unmount()

        expect(window.removeEventListener).toHaveBeenCalled()
    })

    it('should invoke onMouseDown', () => {
        Object.defineProperty(window.navigator, agent, mockConfig('web'))

        const onMouseDownSpy = jest.spyOn(ReactSmartScrollerHorizontal.prototype, 'onMouseDown')
        const wrapper = shallow(<ReactSmartScrollerHorizontal {...initialProps}/>)

        const event = {
            preventDefault: jest.fn()
        }

        wrapper.find(RectangleThumb).simulate('mousedown', event)

        expect(onMouseDownSpy).toHaveBeenCalled()
    })

    it('should set state after measureContainers invoked', () => {
        const wrapper = shallow<ReactSmartScrollerHorizontal>(
            <ReactSmartScrollerHorizontal
                {...initialProps}
                numCols={undefined}
            />
        )
        const wrapperInstance = wrapper.instance()
        const getRefCurrent = (refName: string, refContent: {}) => wrapperInstance[refName].current = refContent as HTMLDivElement
        const value = 100
        const documentWidth = 1000
        const trackHeight = 50

        getRefCurrent('thumbRef' , {
            offsetWidth: value,
            offsetHeight: value
        })
        getRefCurrent('overflowContainerRef' , {
            children: [],
            clientWidth: documentWidth
        })
        getRefCurrent('trackRef' , {
            clientHeight: trackHeight
        })

        wrapperInstance.measureContainers()

        expect(wrapper.state().thumbHeight).toEqual(value)
        expect(wrapper.state().trackHeight).toEqual(trackHeight)
        expect(wrapper.state().scrollContainerWidth).toEqual(documentWidth)
    })

    it('should change thumbRef after measureContainers invoked', () => {
        const wrapper = shallow<ReactSmartScrollerHorizontal>(
            <ReactSmartScrollerHorizontal
                {...initialProps}
                numCols={undefined}
            />
        )
        const wrapperInstance = wrapper.instance()
        const getRefCurrent = (refName: string, refContent: {}) => wrapperInstance[refName].current = refContent as HTMLDivElement
        const value = 100
        const documentWidth = 500
        const trackHeight = 50
        const thumbOffsetLeft = 800
        const overflownRef = 'overflowContainerRef'
        const thumbRef = 'thumbRef'

        getRefCurrent('thumbRef' , {
            clientWidth: value,
            clientHeight: value,
            offsetLeft: thumbOffsetLeft,
            style: {
                left: 0
            }
        })
        getRefCurrent(overflownRef , {
            children: [],
            clientWidth: documentWidth,
            scroll: jest.fn()
        })
        getRefCurrent('trackRef' , {
            clientHeight: trackHeight
        })

        wrapperInstance.measureContainers()

        expect(wrapperInstance[thumbRef].current!.style.left).toEqual(`${documentWidth - value}px`)
    })

    it('should change state after onMouseDown', () => {
        const padding = 20
        const wrapper = shallow<ReactSmartScrollerHorizontal>(
            <ReactSmartScrollerHorizontal
                {...initialProps}
                numCols={undefined}
                trackProps={{ padding }}
            />
        )
        const wrapperInstance = wrapper.instance()
        const getRefCurrent = (refName: string, refContent: {}) => wrapperInstance[refName].current = refContent as HTMLDivElement
        const offsetLeft = 50
        const clientX = 100
        const onMouseDownEvent = {
            clientX,
            preventDefault: jest.fn()
        }

        getRefCurrent('thumbRef' , {
            offsetLeft
        })

        wrapper.find(RectangleThumb).simulate('mousedown', onMouseDownEvent)

        expect(wrapper.state().deltaXOrigin).toEqual(offsetLeft)
        expect(wrapper.state().deltaX).toEqual(clientX + padding)

        wrapper.setProps({
            trackProps: undefined
        })

        wrapper.find(RectangleThumb).simulate('mousedown', onMouseDownEvent)

        expect(wrapper.state().deltaXOrigin).toEqual(offsetLeft)
        expect(wrapper.state().deltaX).toEqual(clientX + padding)
    })

    it('should set thumb left style', () => {
        const wrapper = shallow<ReactSmartScrollerHorizontal>(
            <ReactSmartScrollerHorizontal
                {...initialProps}
                numCols={undefined}
            />
        )
        const wrapperInstance = wrapper.instance()
        const getRefCurrent = (refName: string, refContent: {}) => wrapperInstance[refName].current = refContent as HTMLDivElement
        const clientX = 100
        const state = {
            deltaX: 50,
            deltaXOrigin: 0,
            scrollContainerWidth: 500
        }
        const thumbRef = 'thumbRef'
        const onMouseDragEvent = {
            clientX
        } as DragEvent
        const offset = clientX - state.deltaX + state.deltaXOrigin

        wrapper.setState(state)

        getRefCurrent('overflowContainerRef' , {
            scroll: jest.fn(),
            getBoundingClientRect: jest.fn(() => ({ left: 0 }))
        })
        getRefCurrent('thumbRef' , {
            style: {
                left: 0
            },
            offsetWidth: 100
        })

        wrapperInstance.onMouseDrag(onMouseDragEvent)

        expect(wrapperInstance[thumbRef].current!.style.left).toEqual(`${offset}px`)

        wrapperInstance.onMouseDrag({ clientX: -clientX } as DragEvent)

        expect(wrapperInstance[thumbRef].current!.style.left).toEqual(`${0}px`)
    })

    it('should set thumb left style when overflownScrollContent scrolled', () => {
        const wrapper = shallow<ReactSmartScrollerHorizontal>(
            <ReactSmartScrollerHorizontal
                {...initialProps}
                numCols={undefined}
            />
        )
        const wrapperInstance = wrapper.instance()
        const getRefCurrent = (refName: string, refContent: {}) => wrapperInstance[refName].current = refContent as HTMLDivElement
        const state = {
            scrollContainerWidth: 500
        }
        const thumbWidth = 100
        const scrollWidth = 1000
        const clientWidth = 100
        const scrollLeft = 50
        const thumbRef = 'thumbRef'

        getRefCurrent('overflowContainerRef' , {
            scrollWidth,
            clientWidth,
            scrollLeft,
            children: []
        })
        getRefCurrent('thumbRef' , {
            offsetWidth: thumbWidth,
            style: {
                left: scrollLeft
            }
        })

        wrapper.setState(state)

        wrapperInstance.onOverflowContentScroll()

        expect(wrapperInstance[thumbRef].current!.style.left).toEqual(`${scrollLeft * wrapperInstance.state.ratio}px`)
    })

    it('should render custom thumb if provided', () => {
        React.cloneElement = jest.fn()

        shallow<ReactSmartScrollerHorizontal>(
            <ReactSmartScrollerHorizontal
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

        const wrapper = shallow<ReactSmartScrollerHorizontal>(<ReactSmartScrollerHorizontal/>)
        const wrapperInstance = wrapper.instance()

        wrapperInstance.deleteMouseMoveEvent()

        expect(window.removeEventListener).toHaveBeenCalled()
    })

    it('should invoke scroll on overflownRef', () => {
        const wrapper = shallow<ReactSmartScrollerHorizontal>(<ReactSmartScrollerHorizontal{...initialProps}/>)
        const wrapperInstance = wrapper.instance()
        const getRefCurrent = (refName: string, refContent: {}) => wrapperInstance[refName].current = refContent as HTMLDivElement
        const state = {
            deltaX: 50,
            deltaXOrigin: 0,
            scrollContainerWidth: 500
        }
        const thumbRef = 'thumbRef'
        const overflowContainerRef = 'overflowContainerRef'
        const event = {
            clientX: 123
        } as React.MouseEvent

        wrapper.setState(state)

        getRefCurrent(overflowContainerRef , {
            scroll: jest.fn(),
            getBoundingClientRect: jest.fn(() => ({ left: 0 }))
        })
        getRefCurrent(thumbRef , {
            style: {
                left: 0
            },
            clientWidth: 100,
            offsetLeft: 0
        })

        wrapperInstance.onScrollbarClick(event)

        expect(wrapperInstance[overflowContainerRef].current!.scroll).toHaveBeenCalled()
    })

    it('should return null if thumbClicked on onScrollbarClick response', () => {
        const wrapper = shallow<ReactSmartScrollerHorizontal>(<ReactSmartScrollerHorizontal{...initialProps}/>)
        const wrapperInstance = wrapper.instance()
        const getRefCurrent = (refName: string, refContent: {}) => wrapperInstance[refName].current = refContent as HTMLDivElement
        const state = {
            deltaX: 50,
            deltaXOrigin: 0,
            scrollContainerWidth: 500
        }
        const thumbRef = 'thumbRef'
        const overflowContainerRef = 'overflowContainerRef'
        const event = {
            clientX: 0
        } as React.MouseEvent

        wrapper.setState(state)

        getRefCurrent(overflowContainerRef , {
            scroll: jest.fn(),
            getBoundingClientRect: jest.fn(() => ({ left: 0 }))
        })
        getRefCurrent(thumbRef , {
            style: {
                left: 0
            },
            offsetWidth: 100,
            offsetLeft: 0
        })

        wrapperInstance.onScrollbarClick(event)

        expect(wrapperInstance[overflowContainerRef].current!.scroll).not.toHaveBeenCalled()
    })

    it('should return not changed scrollContainerWidth', () => {
        const wrapper = shallow<ReactSmartScrollerHorizontal>(
            <ReactSmartScrollerHorizontal
                {...initialProps}
                trackProps={undefined}
            />
        )
        const wrapperInstance = wrapper.instance()
        const containerWidth = 100
        const padding = 20

        expect(wrapperInstance.scrollContainerReducedWidth(containerWidth)).toEqual(containerWidth)

        wrapper.setState({
            padding: {
                top: padding,
                right: padding,
                bottom: padding,
                left: padding
            }
        })

        expect(wrapperInstance.scrollContainerReducedWidth(containerWidth)).toEqual(containerWidth - 2 * padding)
    })

    it('should invoke scroll after content dragged', () => {
        const wrapper = shallow<ReactSmartScrollerHorizontal>(<ReactSmartScrollerHorizontal {...initialProps}/>)
        const wrapperInstance = wrapper.instance()
        const getRefCurrent = (refName: string, refContent: {}) => wrapperInstance[refName].current = refContent as HTMLDivElement
        const state = {
            deltaX: 50
        }
        const overflowContainerRef = 'overflowContainerRef'
        const event = {
            clientX: 123
        } as MouseEvent

        wrapper.setState(state)

        getRefCurrent(overflowContainerRef , {
            scroll: jest.fn()
        })

        wrapperInstance.onOverflowContentDrag(event)

        expect(wrapperInstance[overflowContainerRef].current!.scroll).toHaveBeenCalled()
    })

    it('should not invoke scroll after component dragged', () => {
        const wrapper = shallow<ReactSmartScrollerHorizontal>(<ReactSmartScrollerHorizontal {...initialProps}/>)
        const wrapperInstance = wrapper.instance()
        const getRefCurrent = (refName: string, refContent: {}) => wrapperInstance[refName].current = refContent as HTMLDivElement
        const overflowContainerRef = 'overflowContainerRef'
        const event = {
            clientX: 0
        } as MouseEvent

        getRefCurrent(overflowContainerRef , {
            scroll: jest.fn()
        })

        wrapperInstance.onOverflowContentDrag(event)

        expect(wrapperInstance[overflowContainerRef].current!.scroll).not.toHaveBeenCalled()
    })

    it('should invoke event listener and setState after onOverflowContentMouseDown', () => {
        window.addEventListener = jest.fn()

        const wrapper = shallow<ReactSmartScrollerHorizontal>(
            <ReactSmartScrollerHorizontal
                {...initialProps}
                draggable
            />
        )
        const wrapperInstance = wrapper.instance()
        const getRefCurrent = (refName: string, refContent: {}) => wrapperInstance[refName].current = refContent as HTMLDivElement
        const overflowContainerRef = 'overflowContainerRef'
        const state = {
            deltaX: 123,
            scrollLeft: 0
        }
        const event = {
            clientX: state.deltaX,
            preventDefault: jest.fn()
        }

        getRefCurrent(overflowContainerRef , {
            scrollLeft: state.scrollLeft,
            children: []
        })

        wrapper.find(SecondWrapper).simulate('mousedown', event)

        expect(window.addEventListener).toHaveBeenCalled()
        expect(wrapper.state().deltaX).toEqual(state.deltaX)
        expect(wrapper.state().scrollLeft).toEqual(state.scrollLeft)
    })

    it('should not setState after onOverflowContentMouseDown invoked', () => {
        const wrapper = shallow<ReactSmartScrollerHorizontal>(
            <ReactSmartScrollerHorizontal
                {...initialProps}
                draggable
            />
        )
        const state = {
            deltaX: 0,
            scrollLeft: 0
        }
        const event = {
            clientX: state.deltaX,
            preventDefault: jest.fn()
        }

        wrapper.find(SecondWrapper).simulate('mousedown', event)

        expect(wrapper.state().deltaX).toEqual(state.deltaX)
        expect(wrapper.state().scrollLeft).toEqual(state.scrollLeft)
    })

    it('should invoke removeEventListener after deleteOverflowMouseMoveEvent', () => {
        window.removeEventListener = jest.fn()

        const wrapper = shallow<ReactSmartScrollerHorizontal>(<ReactSmartScrollerHorizontal{...initialProps}/>)
        const wrapperInstance = wrapper.instance()

        wrapperInstance.deleteOverflowMouseMoveEvent()

        expect(window.removeEventListener).toHaveBeenCalled()
    })

    it('should set thumb critical dimensions after mouseDrag', () => {
        const wrapper = shallow<ReactSmartScrollerHorizontal>(
            <ReactSmartScrollerHorizontal
                {...initialProps}
                numCols={undefined}
            />
        )
        const wrapperInstance = wrapper.instance()
        const getRefCurrent = (refName: string, refContent: {}) => wrapperInstance[refName].current = refContent as HTMLDivElement
        const clientX = -100
        const state = {
            deltaX: 50,
            deltaXOrigin: 0,
            scrollContainerWidth: 500,
            thumbHeight: 100
        }
        const thumbRef = 'thumbRef'
        const overflownRef = 'overflowContainerRef'
        const onMouseDragEvent = {
            clientX
        } as DragEvent
        const offset = clientX - state.deltaX + state.deltaXOrigin
        const maximumOffset = state.scrollContainerWidth - 100
        const criticalDimension = offset < 0 ? 0 : maximumOffset
        const criticalScrollerDimensions = offset > 0
            ? 1500 - state.scrollContainerWidth
            : 0

        wrapper.setState(state)

        getRefCurrent(overflownRef , {
            scroll: jest.fn(),
            getBoundingClientRect: jest.fn(() => ({ left: 0 })),
            scrollHeight: 1500,
            offsetWidth: state.scrollContainerWidth
        })
        getRefCurrent(thumbRef , {
            style: {
                left: 0
            },
            offsetWidth: 100,
            offsetHeight: 100
        })

        wrapperInstance.onMouseDrag(onMouseDragEvent)

        expect(wrapperInstance[thumbRef].current!.style.left).toEqual(`${criticalDimension}px`)

        wrapperInstance.onMouseDrag({ clientX } as DragEvent)

        expect(wrapperInstance[thumbRef].current!.style.left).toEqual(`${0}px`)
        expect(wrapperInstance[overflownRef].current!.scroll).toHaveBeenCalled()
        expect(wrapperInstance[overflownRef].current!.scroll).toHaveBeenCalledWith(criticalScrollerDimensions, 0)

        wrapperInstance.onMouseDrag({ clientX: 1000000 } as DragEvent)

        expect(wrapperInstance[thumbRef].current!.style.left).toEqual(`${maximumOffset}px`)
        expect(wrapperInstance[overflownRef].current!.scroll).toHaveBeenCalled()
        expect(wrapperInstance[overflownRef].current!.scroll).toHaveBeenCalledWith(criticalScrollerDimensions, 0)
    })

    it('should return margin after contentMargin invoked', () => {
        const wrapper = shallow<ReactSmartScrollerHorizontal>(<ReactSmartScrollerHorizontal{...initialProps}/>)
        const wrapperInstance = wrapper.instance()
        const state = {
            thumbHeight: 20,
            trackHeight: 100
        }
        const windowsScrollWidth = 20

        wrapper.setState(state)

        expect(wrapperInstance.contentMargin).toEqual(`${state.trackHeight + 10}px`)

        wrapper.setState({
            thumbHeight: 200
        })

        expect(wrapperInstance.contentMargin).toEqual(`${200 + 10}px`)

        Object.defineProperty(window.navigator, agent, mockConfig('Mac'))

        expect(wrapperInstance.contentMargin).toEqual(`${200 + windowsScrollWidth + 10}px`)
    })

    it('should invoke onScrollbarClick after CustomScrollbar clicked', () => {
        ReactSmartScrollerHorizontal.prototype.onScrollbarClick = jest.fn()

        const onScrollbarClickSpy = jest.spyOn(ReactSmartScrollerHorizontal.prototype, 'onScrollbarClick')
        const wrapper = shallow(<ReactSmartScrollerHorizontal {...initialProps}/>)
        const event = {
            clientX: 123
        } as React.MouseEvent

        wrapper.find(Track).simulate('click', event)

        expect(onScrollbarClickSpy).toHaveBeenCalled()
    })
})
