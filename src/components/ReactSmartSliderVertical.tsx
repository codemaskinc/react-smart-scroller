import React, { Fragment } from 'react'
import styled from 'styled-components'
import { Padding, ReactSmartSliderProps } from 'lib/types'
import { C, isMacOs, isMobile } from 'lib/utils'
import { colors } from 'lib/styles'

type ReactSmartSliderVerticalState = {
    scrollContainerHeight: number,
    deltaYOrigin: number,
    deltaY: number,
    thumbWidth: number,
    thumbHeight: number,
    trackWidth: number,
    scrollHeight: number
}

export class ReactSmartSliderVertical extends React.Component<ReactSmartSliderProps, ReactSmartSliderVerticalState> {
    state: ReactSmartSliderVerticalState = {
        scrollContainerHeight: 0,
        deltaYOrigin: 0,
        deltaY: 0,
        thumbWidth: 0,
        thumbHeight: 0,
        trackWidth: 0,
        scrollHeight: 0
    }

    private overflowContainerRef: React.RefObject<HTMLDivElement> = React.createRef()
    private thumbRef: React.RefObject<HTMLDivElement> = React.createRef()
    private trackRef: React.RefObject<HTMLDivElement> = React.createRef()

    constructor(props: ReactSmartSliderProps) {
        super(props)

        this.measureContainers = this.measureContainers.bind(this)
        this.onMouseDown = this.onMouseDown.bind(this)
        this.onMouseDrag = this.onMouseDrag.bind(this)
        this.onOverflowContentScroll = this.onOverflowContentScroll.bind(this)
        this.deleteMouseMoveEvent = this.deleteMouseMoveEvent.bind(this)
        this.onScrollbarClick = this.onScrollbarClick.bind(this)
    }

    componentDidMount() {
        window.addEventListener('resize', this.measureContainers)
        window.addEventListener('mouseup', this.deleteMouseMoveEvent)
        this.measureContainers()
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.measureContainers)
        window.removeEventListener('mouseup', this.deleteMouseMoveEvent)
    }

    get shouldRenderScrollbar() {
        const overflownRef = this.overflowContainerRef.current
        const cols = this.props.numCols as number

        if (!cols && overflownRef) {
            return overflownRef.clientHeight < overflownRef.scrollHeight
        }

        return !(overflownRef && overflownRef.children.length <= cols)
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

    scrollContainerReducedHeight(scrollContainerHeight: number) {
        const { trackProps } = this.props

        if (trackProps) {
            const scrollPadding = C.getPaddingValues(
                trackProps.padding,
                trackProps.paddingLeft,
                trackProps.paddingRight,
                trackProps.paddingTop,
                trackProps.paddingBottom
            ) as Padding
            const padding = scrollPadding
                ? scrollPadding.top + scrollPadding.bottom
                : 0

            return scrollContainerHeight - padding
        }

        return scrollContainerHeight
    }

    measureContainers() {
        const overflownRef = this.overflowContainerRef.current as HTMLDivElement
        const thumbRef = this.thumbRef.current as HTMLDivElement
        const trackRef = this.trackRef.current as HTMLDivElement
        const areRefsCurrent = C.all(
            overflownRef,
            thumbRef,
            trackRef
        )

        if (areRefsCurrent) {
            this.setState({
                scrollContainerHeight: this.scrollContainerReducedHeight(overflownRef.clientHeight),
                thumbWidth: thumbRef.clientWidth,
                thumbHeight: thumbRef.clientHeight,
                trackWidth: trackRef.clientWidth,
                scrollHeight: overflownRef.scrollHeight
            })
        }

        if (areRefsCurrent && thumbRef.offsetTop + thumbRef.clientHeight > overflownRef.clientHeight) {
            const scrollCircleTopOffset = thumbRef.offsetTop + thumbRef.clientHeight
            const scrollOffset = scrollCircleTopOffset > overflownRef.clientHeight
                ? overflownRef.clientHeight - thumbRef.clientHeight
                : thumbRef.offsetTop

            overflownRef.scroll(0, overflownRef.scrollHeight)
            thumbRef.style.top = `${scrollOffset}px`
        }
    }

    onMouseDown(event: React.MouseEvent) {
        event.preventDefault()

        const { trackProps } = this.props
        const scrollPadding = trackProps
            ? C.getPaddingValues(trackProps.padding, trackProps.paddingLeft, trackProps.paddingRight) as Padding
            : null
        const padding = scrollPadding
            ? scrollPadding.top
            : 0

        if (this.thumbRef.current) {
            this.setState({
                deltaYOrigin: this.thumbRef.current.offsetTop,
                deltaY: event.clientY + padding
            })
        }

        window.addEventListener('mousemove', this.onMouseDrag)
    }

    onScrollbarClick({ clientY }: React.MouseEvent) {
        const thumbRef = this.thumbRef.current as HTMLDivElement
        const overflowRef = this.overflowContainerRef.current as HTMLDivElement
        const shouldReturn = C.all(
            thumbRef,
            overflowRef,
            clientY >= (thumbRef.offsetTop + overflowRef.getBoundingClientRect().top),
            clientY <= (thumbRef.offsetTop + overflowRef.getBoundingClientRect().top + thumbRef.clientHeight)
        )

        // leave this function if thumb was clicked
        if (shouldReturn) {
            return null
        }

        const maximumOffset = this.state.scrollContainerHeight - thumbRef.clientHeight
        const ratio = (overflowRef.scrollHeight - overflowRef.clientHeight) / maximumOffset
        const deltaY = overflowRef.getBoundingClientRect().top + (thumbRef.clientHeight / 2)

        return overflowRef.scroll({
            top: ratio * (clientY - deltaY),
            left: 0,
            behavior: 'smooth'
        })
    }

    deleteMouseMoveEvent() {
        window.removeEventListener('mousemove', this.onMouseDrag)
    }

    onMouseDrag(event: DragEvent | MouseEvent) {
        const zero = 0
        const { deltaY, deltaYOrigin, scrollContainerHeight, thumbHeight } = this.state
        const overflowRef = this.overflowContainerRef.current as HTMLDivElement
        const thumbRef = this.thumbRef.current as HTMLDivElement
        const maximumOffset = scrollContainerHeight - thumbHeight
        const offset = event.clientY - deltaY + deltaYOrigin
        const isBetweenClientHeight = offset >= zero && offset <= maximumOffset
        const areRefsCurrent = C.all(
            Boolean(this.overflowContainerRef.current),
            Boolean(this.thumbRef.current)
        )

        if (areRefsCurrent && !isBetweenClientHeight) {
            const criticalDimension = offset < zero ? zero: maximumOffset
            const criticalScrollerDimensions = offset > zero
                ? overflowRef.scrollHeight - overflowRef.clientHeight
                : zero

            thumbRef.style.top = `${criticalDimension}px`
            overflowRef.scroll(zero, criticalScrollerDimensions)
        }

        if (areRefsCurrent && isBetweenClientHeight) {
            const ratio = (overflowRef.scrollHeight - overflowRef.clientHeight) / maximumOffset

            overflowRef.scroll(zero, ratio * offset)
            thumbRef.style.top = `${offset}px`
        }
    }

    onOverflowContentScroll() {
        const { scrollContainerHeight, thumbHeight } = this.state
        const thumbRef = this.thumbRef.current  as HTMLDivElement
        const maximumOffset = scrollContainerHeight - thumbHeight
        const overflowRef = this.overflowContainerRef.current

        if (overflowRef && thumbRef) {
            const ratio = maximumOffset / (overflowRef.scrollHeight - overflowRef.clientHeight)

            thumbRef.style.top = `${overflowRef.scrollTop * ratio}px`
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
                        right: this.rightOffset,
                        boxSizing: 'border-box',
                        ...this.props.thumb.props.style
                    }
                }
            )
        }

        return (
            <RectangleThumb
                ref={this.thumbRef}
                onMouseDown={this.onMouseDown}
                style={{
                    height
                }}
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
                    display: display ? 'block' : 'none',
                    ...this.props.trackProps
                }}
            >
                {this.renderThumb()}
            </Track>
        )
    }

    renderChildren() {
        const cols = this.props.numCols as number
        const spacing = this.props.spacing as number
        const height = cols ? `calc((100% - ${(cols - 1) * spacing}px) / ${cols})` : 'unset'
        const padding = spacing / 2
        const children = this.props.children as ChildNode

        return React.Children.map(children, (child: ChildNode, index: number) => {
            const paddingBottom = index !== React.Children.count(children) - 1
                ? `paddingBottom: ${padding}px`
                : undefined
            const paddingTop = index !== 0
                ? `paddingTop: ${padding}px`
                : undefined

            return (
                <ChildrenWrapper
                    style={{
                        padding: `${padding}px 0`,
                        height,
                        paddingTop,
                        paddingBottom,
                        marginRight: this.contentMargin
                    }}
                >
                    {child}
                </ChildrenWrapper>
            )
        })
    }

    render() {
        return (
            <Fragment>
                <Content
                    ref={this.overflowContainerRef}
                    onScroll={this.onOverflowContentScroll}
                    onLoad={this.measureContainers}
                >
                    {this.renderChildren()}
                </Content>
                {this.renderScrollbar()}
            </Fragment>
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

export const ChildrenWrapper = styled.div``

export const Track = styled.div`
    position: absolute;
    display: block;
    cursor: pointer;
    right: 0;
    height: 100%;
    background-color: ${colors.gray.mediumGray};
    top: 0;
    width: 10px;
`

export const RectangleThumb = styled.div`
    position: relative;
    background-color: ${colors.primary};
    cursor: pointer;
    width: 10px;
    height: 100%;
`
