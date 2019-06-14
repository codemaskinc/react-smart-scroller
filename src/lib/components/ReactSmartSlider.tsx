import React from 'react'
import styled from 'styled-components'
import { colors } from 'styles'
import { Padding, ReactSmartSliderProps } from 'types'
import { C, isMobile, isMacOs } from 'utils'

type ReactSmartSliderState = {
    scrollContainerWidth: number,
    deltaXOrigin: number,
    deltaX: number,
    thumbWidth: number,
    thumbHeight: number,
    trackHeight: number,
    scrollWidth: number
}

export class ReactSmartSlider extends React.Component<ReactSmartSliderProps, ReactSmartSliderState> {
    static defaultProps: Partial<ReactSmartSliderProps> = {
        spacing: 0
    }

    state: ReactSmartSliderState = {
        scrollContainerWidth: 0,
        deltaXOrigin: 0,
        deltaX: 0,
        thumbWidth: 0,
        thumbHeight: 0,
        trackHeight: 0,
        scrollWidth: 0
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
            const scrollPadding = C.getPaddingValues(trackProps.padding, trackProps.paddingLeft, trackProps.paddingRight) as Padding
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
                thumbWidth: thumbRef.clientWidth,
                thumbHeight: thumbRef.clientHeight,
                trackHeight: trackRef.clientHeight,
                scrollWidth: overflownRef.scrollWidth
            })
        }

        if (areRefsCurrent && thumbRef.offsetLeft + thumbRef.clientWidth > overflownRef.clientWidth) {
            const scrollCircleLeftOffset = thumbRef.offsetLeft + thumbRef.clientWidth
            const scrollOffset = scrollCircleLeftOffset > overflownRef.clientWidth
                ? overflownRef.clientWidth - thumbRef.clientWidth
                : thumbRef.offsetLeft

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
            clientX <= (thumbRef.offsetLeft + overflowRef.getBoundingClientRect().left + thumbRef.clientWidth)
        )

        // leave this function if thumb was clicked
        if (shouldReturn) {
            return null
        }

        const maximumOffset = this.state.scrollContainerWidth - thumbRef.clientWidth
        const ratio = (overflowRef.scrollWidth - overflowRef.clientWidth) / maximumOffset
        const deltaX = overflowRef.getBoundingClientRect().left + (thumbRef.clientWidth / 2)

        return overflowRef.scroll({
            left: ratio * (clientX - deltaX),
            top: 0,
            behavior: 'smooth'
        })
    }

    deleteMouseMoveEvent() {
        window.removeEventListener('mousemove', this.onMouseDrag)
    }

    onMouseDrag(event: DragEvent | MouseEvent) {
        const { deltaX, deltaXOrigin, scrollContainerWidth, thumbWidth } = this.state
        const overflowRef = this.overflowContainerRef.current as HTMLDivElement
        const thumbRef = this.thumbRef.current as HTMLDivElement
        const maximumOffset = scrollContainerWidth - thumbWidth
        const offset = event.clientX - deltaX + deltaXOrigin
        const isBetweenClientWidth = offset >= 0 && offset <= maximumOffset
        const areRefsCurrent = C.all(
            Boolean(this.overflowContainerRef.current),
            Boolean(this.thumbRef.current)
        )
        const { trackProps } = this.props
        const scrollPadding = trackProps
            ? C.getPaddingValues(trackProps.padding, trackProps.paddingLeft, trackProps.paddingRight) as Padding
            : null
        const padding = scrollPadding
            ? scrollPadding.left
            : 0

        if (areRefsCurrent && !isBetweenClientWidth) {
            const marginLeft = overflowRef.getBoundingClientRect().left + thumbRef.clientWidth - thumbRef.offsetLeft
            const criticalDimension = event.clientX < marginLeft + padding ? 0 : maximumOffset
            const criticalScrollerDimensions = event.clientX > marginLeft + padding
                ? overflowRef.scrollWidth - overflowRef.clientWidth
                : 0

            thumbRef.style.left = `${criticalDimension}px`
            overflowRef.scroll(criticalScrollerDimensions, 0)
        }

        if (areRefsCurrent && isBetweenClientWidth) {
            const ratio = (overflowRef.scrollWidth - overflowRef.clientWidth) / maximumOffset

            overflowRef.scroll(ratio * offset, 0)
            thumbRef.style.left = `${offset}px`
        }
    }

    onOverflowContentScroll() {
        const { scrollContainerWidth, thumbWidth } = this.state
        const thumbRef = this.thumbRef.current  as HTMLDivElement
        const maximumOffset = scrollContainerWidth - thumbWidth
        const overflowRef = this.overflowContainerRef.current

        if (overflowRef && thumbRef) {
            const ratio = maximumOffset / (overflowRef.scrollWidth - overflowRef.clientWidth)

            thumbRef.style.left = `${overflowRef.scrollLeft * ratio}px`
        }
    }

    renderChildren() {
        const cols = this.props.numCols as number
        const spacing = this.props.spacing as number
        const flexBasis = cols ? `${100 / cols}%` : 'unset'
        const padding = spacing / 2
        const children = this.props.children as ChildNode

        return React.Children.map(children, (child: ChildNode, index: number) => {
            const paddingRight = index !== React.Children.count(children) - 1
                ? `paddingRight: ${padding}px`
                : undefined
            const paddingLeft = index !== 0
                ? `paddingLeft: ${padding}px`
                : undefined

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
        const { scrollContainerWidth, scrollWidth } = this.state
        const percentageWidth = Number(((scrollContainerWidth * 100) / scrollWidth).toFixed(0))
        const width = `${(percentageWidth * scrollContainerWidth) / 100}px`

        if (this.props.thumb) {
            const thumb = React.cloneElement(
                this.props.thumb,
                {
                    ref: this.thumbRef,
                    onMouseDown: this.onMouseDown,
                    style: {
                        left: 0,
                        position: 'relative',
                        cursor: 'pointer',
                        ...this.props.thumb.props.style
                    }
                }
            )

            return (
                <Track
                    ref={this.trackRef}
                    onClick={this.onScrollbarClick}
                    style={{
                        color: colors.gray.mediumGray,
                        bottom: this.bottomOffset,
                        ...this.props.trackProps
                    }}
                >
                    {thumb}
                </Track>
            )
        }

        return (
            <RectangleThumb
                ref={this.thumbRef}
                onMouseDown={this.onMouseDown}
                style={{
                    width
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

    render() {
        return (
            <Wrapper>
                <SecondWrapper
                    ref={this.overflowContainerRef}
                    onScroll={this.onOverflowContentScroll}
                    onLoad={this.measureContainers}
                >
                    {this.renderChildren()}
                </SecondWrapper>
                {this.renderScrollbar()}
            </Wrapper>
        )
    }
}

export const Wrapper = styled.div`
    width: 100%;
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
    display: flex;
    align-items: center;
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
    height: 100%;
`
