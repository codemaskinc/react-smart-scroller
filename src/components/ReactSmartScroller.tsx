import React, { Fragment } from 'react'
import styled from 'styled-components'
import { colors } from 'lib/styles'
import { Padding, ReactSmartSliderProps } from 'lib/types'
import { C, isMobile, isMacOs } from 'lib/utils'
import { ReactSmartScrollerVertical } from './ReactSmartScrollerVertical'

type ReactSmartSliderState = {
    scrollContainerWidth: number,
    deltaXOrigin: number,
    deltaX: number,
    thumbHeight: number,
    trackHeight: number,
    scrollWidth: number,
    scrollLeft: number
}

export class ReactSmartScroller extends React.Component<ReactSmartSliderProps, ReactSmartSliderState> {
    static defaultProps: Partial<ReactSmartSliderProps> = {
        spacing: 0,
        vertical: false,
        draggable: false
    }

    state: ReactSmartSliderState = {
        scrollContainerWidth: 0,
        deltaXOrigin: 0,
        deltaX: 0,
        thumbHeight: 0,
        trackHeight: 0,
        scrollWidth: 0,
        scrollLeft: 0
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
        this.onOverflowContentDrag = this.onOverflowContentDrag.bind(this)
        this.onOverflowContentMouseDown = this.onOverflowContentMouseDown.bind(this)
        this.deleteOverflowMouseMoveEvent = this.deleteOverflowMouseMoveEvent.bind(this)
    }

    componentDidMount() {
        window.addEventListener('resize', this.measureContainers)
        window.addEventListener('mouseup', this.deleteMouseMoveEvent)
        window.addEventListener('mouseup', this.deleteOverflowMouseMoveEvent)
        this.measureContainers()
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.measureContainers)
        window.removeEventListener('mouseup', this.deleteMouseMoveEvent)
        window.removeEventListener('mouseup', this.deleteOverflowMouseMoveEvent)
    }

    get shouldRenderScrollbar() {
        const overflownRef = this.overflowContainerRef.current
        const cols = this.props.numCols as number

        if (!cols && overflownRef) {
            return overflownRef.clientWidth < overflownRef.scrollWidth
        }

        return !(overflownRef && overflownRef.children.length <= cols)
    }

    get contentMargin() {
        const { thumbHeight, trackHeight } = this.state
        const windowsScrollHeight = 20
        const marginHeight = trackHeight > thumbHeight ? trackHeight : thumbHeight
        const margin = isMacOs() ? marginHeight + windowsScrollHeight : marginHeight

        return !isMobile() && this.shouldRenderScrollbar
            ? `${margin + 10}px`
            : '20px'
    }

    get bottomOffset() {
        return this.state.thumbHeight > this.state.trackHeight
            ? (this.state.thumbHeight - this.state.trackHeight) / 2
            : 0
    }

    scrollContainerReducedWidth(scrollContainerWidth: number) {
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
                ? scrollPadding.left + scrollPadding.right
                : 0

            return scrollContainerWidth - padding
        }

        return scrollContainerWidth
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
                scrollContainerWidth: this.scrollContainerReducedWidth(overflownRef.clientWidth),
                thumbHeight: thumbRef.offsetHeight,
                trackHeight: trackRef.clientHeight,
                scrollWidth: overflownRef.scrollWidth
            })
        }

        if (areRefsCurrent && thumbRef.offsetLeft + thumbRef.clientWidth > overflownRef.clientWidth) {
            const scrollOffset = overflownRef.clientWidth - thumbRef.clientWidth

            overflownRef.scroll(overflownRef.scrollWidth, 0)
            thumbRef.style.left = `${scrollOffset}px`
        }
    }

    onMouseDown(event: React.MouseEvent) {
        event.preventDefault()

        const { trackProps } = this.props
        const scrollPadding = trackProps
            ? C.getPaddingValues(trackProps.padding, trackProps.paddingLeft, trackProps.paddingRight) as Padding
            : null
        const padding = scrollPadding
            ? scrollPadding.left
            : 0

        if (this.thumbRef.current) {
            this.setState({
                deltaXOrigin: this.thumbRef.current.offsetLeft,
                deltaX: event.clientX + padding
            })
        }

        window.addEventListener('mousemove', this.onMouseDrag)
    }

    onScrollbarClick({ clientX }: React.MouseEvent) {
        const thumbRef = this.thumbRef.current as HTMLDivElement
        const overflowRef = this.overflowContainerRef.current as HTMLDivElement
        const shouldReturn = C.all(
            thumbRef,
            overflowRef,
            clientX >= (thumbRef.offsetLeft + overflowRef.getBoundingClientRect().left),
            clientX <= (thumbRef.offsetLeft + overflowRef.getBoundingClientRect().left + thumbRef.offsetWidth)
        )

        // leave this function if thumb was clicked
        if (shouldReturn) {
            return null
        }

        const maximumOffset = this.state.scrollContainerWidth - thumbRef.offsetWidth
        const ratio = (overflowRef.scrollWidth - overflowRef.clientWidth) / maximumOffset
        const deltaX = overflowRef.getBoundingClientRect().left + (thumbRef.offsetWidth / 2)

        return overflowRef.scroll({
            left: ratio * (clientX - deltaX),
            top: 0,
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
        const { deltaX, deltaXOrigin, scrollContainerWidth } = this.state
        const overflowRef = this.overflowContainerRef.current as HTMLDivElement
        const thumbRef = this.thumbRef.current as HTMLDivElement
        const maximumOffset = scrollContainerWidth - thumbRef.offsetWidth
        const offset = event.clientX - deltaX + deltaXOrigin
        const isBetweenClientWidth = offset >= zero && offset <= maximumOffset
        const areRefsCurrent = C.all(
            Boolean(this.overflowContainerRef.current),
            Boolean(this.thumbRef.current)
        )

        if (areRefsCurrent && !isBetweenClientWidth) {
            const criticalDimension = offset < zero ? zero : maximumOffset
            const criticalScrollerDimensions = offset > zero
                ? overflowRef.scrollWidth - overflowRef.clientWidth
                : zero

            thumbRef.style.left = `${criticalDimension}px`
            overflowRef.scroll(criticalScrollerDimensions, zero)
        }

        if (areRefsCurrent && isBetweenClientWidth) {
            const ratio = (overflowRef.scrollWidth - overflowRef.clientWidth) / maximumOffset

            overflowRef.scroll(ratio * offset, zero)
            thumbRef.style.left = `${offset}px`
        }
    }

    onOverflowContentScroll() {
        const { scrollContainerWidth } = this.state
        const thumbRef = this.thumbRef.current  as HTMLDivElement
        const overflowRef = this.overflowContainerRef.current

        if (overflowRef && thumbRef) {
            const maximumOffset = scrollContainerWidth - thumbRef.offsetWidth
            const ratio = maximumOffset / (overflowRef.scrollWidth - overflowRef.clientWidth)

            thumbRef.style.left = `${overflowRef.scrollLeft * ratio}px`
        }
    }

    onOverflowContentMouseDown(event: React.MouseEvent) {
        event.preventDefault()

        const overflowRef = this.overflowContainerRef.current

        if (overflowRef) {
            this.setState({
                deltaX: event.clientX,
                scrollLeft: overflowRef.scrollLeft
            })
        }

        window.addEventListener('mousemove', this.onOverflowContentDrag)
    }

    onOverflowContentDrag(event: MouseEvent | DragEvent) {
        const { deltaX, scrollLeft } = this.state
        const overflowRef = this.overflowContainerRef.current

        if (overflowRef && event.clientX !== 0) {
            overflowRef.scroll(scrollLeft - (event.clientX - deltaX), 0)
        }
    }

    renderChildren() {
        const cols = this.props.numCols as number
        const spacing = this.props.spacing as number
        const padding = spacing / 2
        const children = this.props.children as ChildNode

        return React.Children.map(children, (child: ChildNode, index: number) => {
            const paddingRight = index !== React.Children.count(children) - 1
                ? `paddingRight: ${padding}px`
                : undefined
            const paddingLeft = index !== 0
                ? `paddingLeft: ${padding}px`
                : undefined
            const flexBasis = cols ? `calc(100% / ${cols})` : 'unset'

            return (
                <ChildrenWrapper
                    style={{
                        padding: `0 ${padding}px`,
                        flexBasis,
                        paddingRight,
                        paddingLeft,
                        marginBottom: this.contentMargin
                    }}
                >
                    {child}
                </ChildrenWrapper>
            )
        })
    }

    renderThumb() {
        const { scrollContainerWidth, scrollWidth, thumbHeight, trackHeight } = this.state
        const percentageWidth = Number(((scrollContainerWidth * 100) / scrollWidth).toFixed(0))
        const width = `${(percentageWidth * scrollContainerWidth) / 100}px`
        const bottom = this.bottomOffset !== 0
            ? this.bottomOffset
            : (thumbHeight - trackHeight) / 2

        if (this.props.thumb) {
            return React.cloneElement(
                this.props.thumb,
                {
                    ref: this.thumbRef,
                    onMouseDown: this.onMouseDown,
                    style: {
                        left: 0,
                        position: 'relative',
                        cursor: 'pointer',
                        bottom,
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
                    width,
                    bottom
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
                    bottom: this.bottomOffset,
                    display: display ? 'block' : 'none',
                    ...this.props.trackProps
                }}
            >
                {this.renderThumb()}
            </Track>
        )
    }

    renderContent() {
        const { draggable } = this.props
        const cursor = draggable ? 'pointer' : 'unset'

        return !this.props.vertical ? (
            <Fragment>
                <SecondWrapper
                    ref={this.overflowContainerRef}
                    onScroll={this.onOverflowContentScroll}
                    onLoad={this.measureContainers}
                    onMouseDown={draggable ? this.onOverflowContentMouseDown : C.noop}
                    style={{ cursor }}
                >
                    {this.renderChildren()}
                </SecondWrapper>
                {this.renderScrollbar()}
            </Fragment>
        ) : (
            <ReactSmartScrollerVertical {...this.props}/>
        )
    }

    render() {
        return (
            <Wrapper>
                {this.renderContent()}
            </Wrapper>
        )
    }
}

export const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
`

export const SecondWrapper = styled.div`
    display: flex;
    overflow-x: scroll;
    overflow-y: hidden;
    margin-bottom: -20px;
    -webkit-overflow-scrolling: touch;
`

export const ChildrenWrapper = styled.div`
    flex: 0 0 auto;
`

export const Track = styled.div`
    position: absolute;
    cursor: pointer;
    left: 0;
    width: 100%;
    background-color: ${colors.gray.mediumGray};
    bottom: 0;
    height: 10px;
`

export const RectangleThumb = styled.div`
    position: relative;
    left: 0;
    background-color: ${colors.primary};
    cursor: pointer;
    width: 100px;
    height: 10px;
`
