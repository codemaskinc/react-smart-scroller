import React from 'react'
import styled from 'styled-components'
import { Padding, ReactSmartScrollerProps } from 'lib/types'
import { C, isMacOs, isMobile } from 'lib/utils'
import { colors } from 'lib/styles'
import { constants } from 'lib/common'

type ReactSmartSliderVerticalState = {
    scrollContainerHeight: number,
    deltaYOrigin: number,
    deltaY: number,
    thumbWidth: number,
    trackWidth: number,
    scrollHeight: number,
    scrollTop: number,
    padding: Padding,
    ratio: number
}

export class ReactSmartScrollerVertical extends React.Component<ReactSmartScrollerProps, ReactSmartSliderVerticalState> {
    state: ReactSmartSliderVerticalState = {
        scrollContainerHeight: 0,
        deltaYOrigin: 0,
        deltaY: 0,
        thumbWidth: 0,
        trackWidth: 0,
        scrollHeight: 0,
        scrollTop: 0,
        padding: this.trackPadding,
        ratio: 1
    }

    private overflowContainerRef: React.RefObject<HTMLDivElement> = React.createRef()
    private thumbRef: React.RefObject<HTMLDivElement> = React.createRef()
    private trackRef: React.RefObject<HTMLDivElement> = React.createRef()

    constructor(props: ReactSmartScrollerProps) {
        super(props)

        this.measureContainers = this.measureContainers.bind(this)
        this.onMouseDown = this.onMouseDown.bind(this)
        this.onMouseDrag = this.onMouseDrag.bind(this)
        this.onOverflowContentScroll = this.onOverflowContentScroll.bind(this)
        this.deleteMouseMoveEvent = this.deleteMouseMoveEvent.bind(this)
        this.onScrollbarClick = this.onScrollbarClick.bind(this)
        this.onOverflowContentMouseDown = this.onOverflowContentMouseDown.bind(this)
        this.onOverflowContentDrag = this.onOverflowContentDrag.bind(this)
        this.deleteOverflowMouseMoveEvent = this.deleteOverflowMouseMoveEvent.bind(this)
    }

    componentDidMount() {
        window.addEventListener('resize', this.measureContainers)
        window.addEventListener('mouseup', this.deleteMouseMoveEvent)
        window.addEventListener('transitionend', this.measureContainers)
        window.addEventListener('mouseup', this.deleteOverflowMouseMoveEvent)
        window.addEventListener('load', this.measureContainers)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.measureContainers)
        window.removeEventListener('mouseup', this.deleteMouseMoveEvent)
        window.removeEventListener('transitionend', this.measureContainers)
        window.removeEventListener('mouseup', this.deleteOverflowMouseMoveEvent)
        window.removeEventListener('load', this.measureContainers)
    }

    get shouldRenderScrollbar() {
        const overflownRef = this.overflowContainerRef.current
        const cols = this.props.numCols as number

        if (!cols && overflownRef) {
            return overflownRef.clientHeight < overflownRef.scrollHeight
        }

        return !(overflownRef && overflownRef.children.length <= cols)
    }

    get trackPadding() {
        const { trackProps } = this.props

        return trackProps
            ? C.getPaddingValues(
                trackProps.padding,
                trackProps.paddingLeft,
                trackProps.paddingRight,
                trackProps.paddingTop,
                trackProps.paddingBottom
            ) as Padding : {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
    }

    get contentMargin() {
        const { thumbWidth, trackWidth } = this.state
        const windowsScrollWidth = 20
        const marginWidth = trackWidth > thumbWidth ? trackWidth : thumbWidth
        const margin = isMacOs() ? marginWidth + windowsScrollWidth : marginWidth

        return !isMobile() && this.shouldRenderScrollbar
            ? `${margin + 10}px`
            : '20px'
    }

    get rightOffset() {
        return this.state.thumbWidth > this.state.trackWidth
            ? (this.state.thumbWidth - this.state.trackWidth) / 2
            : 0
    }

    get startElement() {
        if (this.props.startAt) {
            return document.getElementById(`${constants.reactSmartScrollerId}-${this.props.startAt.startIndex}`)
        }

        return undefined
    }

    setStartPosition() {
        const { startAt } = this.props
        const overflowRef = this.overflowContainerRef.current as HTMLDivElement
        const startElement = this.startElement

        this.measureContainers()

        if (overflowRef && startElement) {
            const offset = startAt && startAt.center
                ? (overflowRef.clientHeight - startElement.clientHeight) / 2
                : 0

            overflowRef.scrollTop = startElement.offsetTop - offset
        }
    }

    scrollContainerReducedHeight(scrollContainerHeight: number) {
        const { padding } = this.state

        return scrollContainerHeight - (padding.top + padding.bottom)
    }

    measureContainers(event?: Event) {
        const overflownRef = this.overflowContainerRef.current as HTMLDivElement
        const thumbRef = this.thumbRef.current as HTMLDivElement
        const trackRef = this.trackRef.current as HTMLDivElement
        const areRefsCurrent = C.all(
            overflownRef,
            thumbRef,
            trackRef
        )

        if (areRefsCurrent) {
            const scrollContainerHeight = this.scrollContainerReducedHeight(overflownRef.clientHeight)
            const maximumOffset = scrollContainerHeight - thumbRef.offsetHeight
            const ratio = maximumOffset / (overflownRef.scrollHeight - overflownRef.clientHeight)

            this.setState({
                scrollContainerHeight,
                thumbWidth: thumbRef.offsetWidth,
                trackWidth: trackRef.clientWidth,
                scrollHeight: overflownRef.scrollHeight,
                ratio
            }, () => {
                if (event && event.type === 'load') {
                    this.setStartPosition()
                }
            })
        }

        if (areRefsCurrent && thumbRef.offsetTop + thumbRef.offsetHeight > overflownRef.clientHeight) {
            const scrollOffset = overflownRef.clientHeight - thumbRef.offsetHeight

            overflownRef.scroll(0, overflownRef.scrollHeight)
            thumbRef.style.top = `${scrollOffset}px`
        }
    }

    onMouseDown(event: React.MouseEvent) {
        event.preventDefault()

        const thumbRef = this.thumbRef.current as HTMLDivElement
        const overflownRef = this.overflowContainerRef.current as HTMLDivElement

        if (thumbRef && overflownRef) {
            this.setState({
                deltaYOrigin: thumbRef.offsetTop,
                deltaY: event.clientY + this.state.padding.top
            })
        }

        window.addEventListener('mousemove', this.onMouseDrag)
    }

    onScrollbarClick({ clientY }: React.MouseEvent) {
        const { padding } = this.state
        const thumbRef = this.thumbRef.current as HTMLDivElement
        const overflowRef = this.overflowContainerRef.current as HTMLDivElement
        const shouldReturn = C.all(
            thumbRef,
            overflowRef,
            clientY >= ((C.extractNumberFromStyle(thumbRef.style.top) || 0) + overflowRef.getBoundingClientRect().top + padding.top),
            clientY <= ((C.extractNumberFromStyle(thumbRef.style.top) || 0) + overflowRef.getBoundingClientRect().top + thumbRef.offsetHeight + padding.top)
        )

        // leave this function if thumb was clicked
        if (shouldReturn) {
            return null
        }

        const maximumOffset = this.state.scrollContainerHeight - thumbRef.offsetHeight
        // this is different ratio than in state
        const ratio = (overflowRef.scrollHeight - overflowRef.clientHeight) / maximumOffset
        const deltaY = overflowRef.getBoundingClientRect().top + (thumbRef.offsetHeight / 2) + padding.top

        return overflowRef.scroll({
            top: ratio * (clientY - deltaY),
            left: 0,
            behavior: 'smooth'
        })
    }

    deleteMouseMoveEvent() {
        window.removeEventListener('mousemove', this.onMouseDrag)
    }

    deleteOverflowMouseMoveEvent() {
        window.removeEventListener('mousemove', this.onOverflowContentDrag)
    }

    onMouseDrag(event: DragEvent | MouseEvent) {
        const zero = 0
        const { deltaY, deltaYOrigin, scrollContainerHeight, padding } = this.state
        const overflowRef = this.overflowContainerRef.current as HTMLDivElement
        const thumbRef = this.thumbRef.current as HTMLDivElement
        const maximumOffset = scrollContainerHeight - thumbRef.offsetHeight
        const offset = event.clientY - deltaY + deltaYOrigin + padding.top
        const isBetweenClientHeight = offset >= zero && offset <= maximumOffset
        const areRefsCurrent = C.all(
            Boolean(this.overflowContainerRef.current),
            Boolean(this.thumbRef.current)
        )

        if (areRefsCurrent && !isBetweenClientHeight) {
            const criticalDimension = offset < zero ? zero: maximumOffset
            const criticalScrollerDimensions = offset > zero
                ? overflowRef.scrollHeight - overflowRef.offsetHeight
                : zero

            thumbRef.style.top = `${criticalDimension}px`
            overflowRef.scroll(zero, criticalScrollerDimensions)
        }

        if (areRefsCurrent && isBetweenClientHeight) {
            // this is different ratio than in state
            const ratio = (overflowRef.scrollHeight - overflowRef.offsetHeight) / maximumOffset

            overflowRef.scroll(zero, ratio * offset)
            thumbRef.style.top = `${offset}px`
        }
    }

    onOverflowContentScroll() {
        const { ratio } = this.state
        const thumbRef = this.thumbRef.current  as HTMLDivElement
        const overflowRef = this.overflowContainerRef.current

        if (overflowRef && thumbRef) {
            thumbRef.style.top = `${overflowRef.scrollTop * ratio}px`
        }
    }

    onOverflowContentMouseDown(event: React.MouseEvent) {
        event.preventDefault()

        const overflowRef = this.overflowContainerRef.current

        if (overflowRef) {
            this.setState({
                deltaY: event.clientY,
                scrollTop: overflowRef.scrollTop
            })
        }

        window.addEventListener('mousemove', this.onOverflowContentDrag)
    }

    onOverflowContentDrag(event: MouseEvent) {
        const { deltaY, scrollTop } = this.state
        const overflowRef = this.overflowContainerRef.current

        if (overflowRef && event.clientY !== 0) {
            overflowRef.scroll(0, scrollTop - (event.clientY - deltaY))
        }
    }

    renderThumb() {
        const { scrollContainerHeight, scrollHeight } = this.state
        const percentageWidth = Number(((scrollContainerHeight * 100) / scrollHeight).toFixed(0))
        const height = `${(percentageWidth * scrollContainerHeight) / 100}px`

        if (this.props.thumb) {
            return React.cloneElement(
                this.props.thumb,
                {
                    ref: this.thumbRef,
                    onMouseDown: this.onMouseDown,
                    style: {
                        top: 0,
                        position: 'relative',
                        cursor: 'pointer',
                        ...this.props.thumb.props.style
                    }
                }
            )
        }

        return (
            <RectangleThumb
                ref={this.thumbRef}
                onMouseDown={this.onMouseDown}
                style={{ height }}
            />
        )
    }

    renderScrollbar() {
        const display = !isMobile() && this.shouldRenderScrollbar

        return (
            <Track
                ref={this.trackRef}
                onClick={this.onScrollbarClick}
                style={{
                    color: colors.gray.mediumGray,
                    right: this.rightOffset,
                    display: display ? 'flex' : 'none',
                    ...this.props.trackProps
                }}
            >
                <EmptyAbsolute>
                    {this.renderThumb()}
                </EmptyAbsolute>
            </Track>
        )
    }

    renderChildren() {
        const cols = this.props.numCols as number
        const spacing = this.props.spacing as number
        const padding = spacing / 2
        const children = this.props.children as ChildNode

        return React.Children.map(children, (child: ChildNode, index: number) => {
            const paddingBottom = index !== React.Children.count(children) - 1
                ? `paddingBottom: ${padding}px`
                : undefined
            const paddingTop = index !== 0
                ? `paddingTop: ${padding}px`
                : undefined
            const height = cols ? `calc(100% / ${cols})` : 'auto'
            const extendedChild = React.cloneElement(
                children[index],
                {
                    style: {
                        display: 'flex',
                        ...children[index].props.style
                    }
                }
            )

            return (
                <ChildrenWrapper
                    id={`${constants.reactSmartScrollerId}-${index}`}
                    style={{
                        padding: `${padding}px 0`,
                        height,
                        paddingTop,
                        paddingBottom,
                        marginRight: this.contentMargin
                    }}
                >
                    {extendedChild}
                </ChildrenWrapper>
            )
        })
    }

    render() {
        const { draggable, style } = this.props
        const cursor = draggable ? 'pointer' : 'unset'

        return (
            <div style={style}>
                <Content
                    style={{ cursor }}
                    ref={this.overflowContainerRef}
                    onScroll={this.onOverflowContentScroll}
                    onMouseDown={draggable ? this.onOverflowContentMouseDown : C.noop}
                >
                    {this.renderChildren()}
                </Content>
                {this.renderScrollbar()}
            </div>
        )
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
`

export const ChildrenWrapper = styled.div`
    box-sizing: border-box;
`

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
`

export const RectangleThumb = styled.div`
    position: relative;
    background-color: ${colors.primary};
    cursor: pointer;
    width: 10px;
    height: 100%;
`

export const EmptyAbsolute = styled.div`
    position: absolute;
`
