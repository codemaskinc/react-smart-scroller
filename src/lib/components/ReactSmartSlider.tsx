import React from 'react'
import styled from 'styled-components'
import { colors } from 'styles'
import { C, isMobile } from 'utils'

export type ReactSmartSliderProps = {
    numCols?: number,
    spacing?: number,
    circleSize?: number,
    circleColor?: string,
    trackHeight?: number,
    trackColor?: string
}

type ReactSmartSliderState = {
    scrollContainerWidth: number,
    deltaXOrigin: number,
    deltaX: number
}

export class ReactSmartSlider extends React.Component<ReactSmartSliderProps, ReactSmartSliderState> {
    static defaultProps: Partial<ReactSmartSliderProps> = {
        numCols: 1,
        spacing: 0,
        circleSize: 15,
        trackHeight: 5,
        circleColor: colors.primary,
        trackColor: colors.gray.mediumGray
    }

    state: ReactSmartSliderState = {
        scrollContainerWidth: 0,
        deltaXOrigin: 0,
        deltaX: 0
    }

    private overflowContainerRef: React.RefObject<HTMLDivElement> = React.createRef()
    private scrollCircleRef: React.RefObject<HTMLDivElement> = React.createRef()

    constructor(props: ReactSmartSliderProps) {
        super(props)

        this.measureContainers = this.measureContainers.bind(this)
        this.onMouseDown = this.onMouseDown.bind(this)
        this.onMouseDrag = this.onMouseDrag.bind(this)
        this.onOverflowContentScroll = this.onOverflowContentScroll.bind(this)
        this.renderCustomScrollbar = this.renderCustomScrollbar.bind(this)
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

        return !(overflownRef && overflownRef.children.length <= cols)
    }

    measureContainers() {
        const overflownRef = this.overflowContainerRef.current as HTMLDivElement
        const scrollCircleRef = this.scrollCircleRef.current as HTMLDivElement
        const circleWidth = this.props.circleSize as number
        const areRefsCurrent = C.all(
            overflownRef,
            scrollCircleRef
        )

        if (areRefsCurrent) {
            this.setState({
                scrollContainerWidth: overflownRef.clientWidth
            })
        }

        if (areRefsCurrent && scrollCircleRef.offsetLeft + circleWidth > overflownRef.clientWidth) {
            const scrollCircleLeftOffset = scrollCircleRef.offsetLeft + circleWidth
            const scrollOffset = scrollCircleLeftOffset > overflownRef.clientWidth
                ? overflownRef.clientWidth - scrollCircleRef.clientWidth
                : scrollCircleRef.offsetLeft

            overflownRef.scroll(overflownRef.scrollWidth, 0)
            scrollCircleRef.style.left = `${scrollOffset}px`
        }
    }

    onMouseDown(event: React.MouseEvent) {
        event.preventDefault()

        if (this.scrollCircleRef.current) {
            this.setState({
                deltaXOrigin: this.scrollCircleRef.current.offsetLeft,
                deltaX: event.clientX
            })
        }

        window.addEventListener('mousemove', this.onMouseDrag)
    }

    onScrollbarClick({ clientX }: React.MouseEvent) {
        const circleSize = this.props.circleSize as number
        const circleRef = this.scrollCircleRef.current as HTMLDivElement
        const overflowRef = this.overflowContainerRef.current as HTMLDivElement
        const shouldReturn = C.all(
            circleRef,
            overflowRef,
            clientX >= (circleRef.offsetLeft + overflowRef.getBoundingClientRect().left),
            clientX <= (circleRef.offsetLeft + overflowRef.getBoundingClientRect().left + circleSize)
        )

        // leave this function if circle was clicked
        if (shouldReturn) {
            return null
        }

        const maximumOffset = this.state.scrollContainerWidth - circleSize
        const ratio = (overflowRef.scrollWidth - overflowRef.clientWidth) / maximumOffset
        const deltaX = overflowRef.getBoundingClientRect().left + (circleSize / 2)

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
        const circleSize = this.props.circleSize as number
        const { deltaX, deltaXOrigin, scrollContainerWidth } = this.state
        const overflowRef = this.overflowContainerRef.current as HTMLDivElement
        const scrollCircleRef = this.scrollCircleRef.current as HTMLDivElement
        const maximumOffset = scrollContainerWidth - circleSize
        const offset = event.clientX - deltaX + deltaXOrigin
        const isBetweenClientWidth = offset >= 0 && offset <= maximumOffset
        const areRefsCurrent = C.all(
            Boolean(this.overflowContainerRef.current),
            Boolean(this.scrollCircleRef.current)
        )

        if (areRefsCurrent && !isBetweenClientWidth) {
            const marginLeft = overflowRef.getBoundingClientRect().left + circleSize
            const criticalDimension = event.clientX < marginLeft ? 0 : maximumOffset
            const criticalScrollerDimensions = event.clientX > marginLeft
                ? overflowRef.scrollWidth - overflowRef.clientWidth
                : 0

            scrollCircleRef.style.left = `${criticalDimension}px`
            overflowRef.scroll(criticalScrollerDimensions, 0)
        }

        if (areRefsCurrent && isBetweenClientWidth) {
            const ratio = (overflowRef.scrollWidth - overflowRef.clientWidth) / maximumOffset

            overflowRef.scroll(ratio * offset, 0)
            scrollCircleRef.style.left = `${offset}px`
        }
    }

    onOverflowContentScroll() {
        const circleSize = this.props.circleSize as number
        const { scrollContainerWidth } = this.state
        const maximumOffset = scrollContainerWidth - circleSize
        const overflowRef = this.overflowContainerRef.current
        const scrollCircleRef = this.scrollCircleRef.current

        if (overflowRef && scrollCircleRef) {
            const ratio = maximumOffset / (overflowRef.scrollWidth - overflowRef.clientWidth)

            scrollCircleRef.style.left = `${overflowRef.scrollLeft * ratio}px`
        }
    }

    renderChildren() {
        const cols = this.props.numCols as number
        const spacing = this.props.spacing as number
        const flexBasis = `${100 / cols}%`
        const padding = spacing / 2
        const children = this.props.children as ChildNode[]

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
                        marginBottom: !isMobile() && this.shouldRenderScrollbar ? '50px' : '20px'
                    }}
                >
                    {child}
                </ChildrenWrapper>
            )
        })
    }

    renderCustomScrollbar() {
        const { trackHeight, trackColor, circleSize, circleColor } = this.props
        const scrollbarHeight = trackHeight as number
        const circleDiameter = circleSize as number
        const bottom = (circleDiameter - scrollbarHeight) / 2

        return !isMobile() && this.shouldRenderScrollbar ? (
            <CustomScrollbar
                style={{
                    height: scrollbarHeight,
                    color: trackColor,
                    bottom
                }}
                onClick={this.onScrollbarClick}
            >
                <ScrollCircle
                    ref={this.scrollCircleRef}
                    onMouseDown={this.onMouseDown}
                    style={{
                        height: circleDiameter,
                        width: circleDiameter,
                        color: circleColor
                    }}
                />
            </CustomScrollbar>
        ) : null
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
                {this.renderCustomScrollbar()}
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
    margin-bottom: -16px;
    -webkit-overflow-scrolling: touch;
`

export const ChildrenWrapper = styled.div`
    flex: 0 0 auto;
`

export const CustomScrollbar = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    cursor: pointer;
    left: 0;
    width: 100%;
    border-radius: 4px;
    background-color: ${colors.gray.mediumGray};
`

export const ScrollCircle = styled.div`
    position: relative;
    left: 0;
    border-radius: 50%;
    background-color: ${colors.primary};
    cursor: pointer;
`
