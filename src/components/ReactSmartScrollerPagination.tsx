import React from 'react'
import styled from 'styled-components'
import { ReactSmartScrollerProps } from 'lib/types'
import { colors } from 'lib/styles'
import { C, isMobile } from 'lib/utils'
import { constants } from 'lib/common'

type ReactSmartScrollerPaginationState = {
    numberOfViews: number,
    paginationIndex: number,
    scrollValue: number,
    children: React.ReactNode,
    deltaX: number,
    deltaY: number,
    scrollLeft: number,
    dragScroll: number,
    lockedMove: boolean,
    horizontal: boolean
}

export class ReactSmartScrollerPagination extends React.Component<ReactSmartScrollerProps, ReactSmartScrollerPaginationState> {
    state: ReactSmartScrollerPaginationState = {
        paginationIndex: 0,
        numberOfViews: 0,
        scrollValue: 0,
        children: this.props.children,
        deltaX: 0,
        scrollLeft: 0,
        dragScroll: 0,
        deltaY: 0,
        horizontal: false,
        lockedMove: false
    }

    private overflowContainerRef: React.RefObject<HTMLDivElement> = React.createRef()

    constructor(props: ReactSmartScrollerProps) {
        super(props)

        this.onNext = this.onNext.bind(this)
        this.onPrevious = this.onPrevious.bind(this)
        this.onDotClick = this.onDotClick.bind(this)
        this.onTouchMove = this.onTouchMove.bind(this)
        this.onTouchStart = this.onTouchStart.bind(this)
        this.updatePosition = this.updatePosition.bind(this)
        this.setStartPosition = this.setStartPosition.bind(this)
        this.onOverflowContentDrag = this.onOverflowContentDrag.bind(this)
        this.onOverflowContentScroll = this.onOverflowContentScroll.bind(this)
        this.onOverflowContentMouseDown = this.onOverflowContentMouseDown.bind(this)
        this.deleteOverflowMouseMoveEvent = this.deleteOverflowMouseMoveEvent.bind(this)
    }

    componentDidMount() {
        this.setState({
            numberOfViews: this.numberOfViews
        })

        window.addEventListener('resize', this.updatePosition)
        window.addEventListener('load', this.setStartPosition)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updatePosition)
        window.removeEventListener('mousemove', this.onOverflowContentDrag)
        window.removeEventListener('mouseup', this.deleteOverflowMouseMoveEvent)
        window.removeEventListener('load', this.setStartPosition)
        this.overflowContainerRef.current?.removeEventListener('touchmove', this.onTouchMove)
        this.overflowContainerRef.current?.removeEventListener('touchend', this.deleteOverflowMouseMoveEvent)
    }

    get childrenCount() {
        return React.Children.count(this.props.children)
    }

    get numberOfViews() {
        const numCols = this.props.numCols || 1

        return Math.ceil(this.childrenCount / numCols)
    }

    get childrenWidth() {
        return React.Children.map(this.props.children, (_, index) => {
            return {
                value: this.overflowContainerRef.current?.children.item(index)?.clientWidth || 0,
                index: index
            }
        })
    }

    setStartPosition() {
        const { startAt, children } = this.props
        const overflowRef = this.overflowContainerRef.current
        const numCols = this.props.numCols || 1
        const position = startAt
            ? startAt.startIndex
            : 0

        if (overflowRef) {
            const page = Math.ceil(position / numCols)
            const childrenCount = React.Children.count(children)
            const maxChildrenPage = Math.ceil(childrenCount / numCols) - 1
            const checkedPage = page < 0
                ? 0
                : page > maxChildrenPage
                    ? maxChildrenPage
                    : page
            const scrollValue = -checkedPage * overflowRef.offsetWidth

            overflowRef.style.transform = `translate(${scrollValue}px)`

            this.setState({
                paginationIndex: checkedPage,
                scrollValue
            })
        }
    }

    updatePosition() {
        const { children } = this.props
        const overflowRef = this.overflowContainerRef.current
        const numCols = this.props.numCols || 1
        const position = this.state.paginationIndex

        if (overflowRef) {
            const page = Math.ceil(position / numCols)
            const childrenCount = React.Children.count(children)
            const maxChildrenPage = Math.ceil(childrenCount / numCols) - 1
            const checkedPage = page < 0
                ? 0
                : page > maxChildrenPage
                    ? maxChildrenPage
                    : page
            const scrollValue = -checkedPage * overflowRef.offsetWidth

            overflowRef.style.transform = `translate(${scrollValue}px)`

            this.setState({
                paginationIndex: checkedPage,
                scrollValue
            })
        }
    }

    onNext() {
        const overflowRef = this.overflowContainerRef.current
        const { paginationIndex, scrollValue } = this.state
        const { paginationConfig } = this.props

        if (overflowRef && paginationConfig && paginationConfig?.withScroll && paginationIndex < this.numberOfViews - 1) {
            const index = paginationIndex + 1
            const newScrollValue = overflowRef.children.item(paginationIndex)?.clientWidth || 0

            overflowRef.scroll({
                left: overflowRef.scrollLeft + newScrollValue,
                top: 0,
                behavior: 'smooth'
            })

            return this.setState({
                paginationIndex: index
            })
        }

        if (overflowRef && paginationIndex === this.numberOfViews - 1 && paginationConfig && paginationConfig.infinite) {
            overflowRef.style.transform = `translate(0px)`

            return this.setState({
                paginationIndex: 0,
                scrollValue: 0
            })
        }

        if (overflowRef && paginationIndex < this.numberOfViews - 1) {
            const index = paginationIndex + 1
            const isLast = overflowRef.clientWidth + Math.abs(this.state.scrollValue) >= overflowRef.scrollWidth

            if (isLast) {
                return
            }

            const newScrollValue = this.props.paginationConfig?.withScroll || this.props.paginationConfig?.renderNextToEachOther
                ? scrollValue - (overflowRef.children.item(paginationIndex)?.clientWidth || 0)
                : scrollValue - overflowRef.offsetWidth

            overflowRef.style.transform = `translate(${newScrollValue}px)`

            return this.setState({
                paginationIndex: index,
                scrollValue: newScrollValue
            })
        }
    }

    onPrevious() {
        const overflowRef = this.overflowContainerRef.current
        const { paginationIndex, scrollValue } = this.state
        const { paginationConfig } = this.props

        if (overflowRef && paginationConfig && paginationConfig?.withScroll && paginationIndex > 0) {
            const index = paginationIndex - 1
            const newScrollValue = overflowRef.children.item(index)?.clientWidth || 0

            overflowRef.scroll({
                left: overflowRef.scrollLeft - newScrollValue,
                top: 0,
                behavior: 'smooth'
            })

            return this.setState({
                paginationIndex: index
            })
        }

        if (overflowRef && paginationIndex === 0 && paginationConfig && paginationConfig.infinite) {
            const index = this.numberOfViews - 1
            const newScrollValue = this.props.paginationConfig?.withScroll || this.props.paginationConfig?.renderNextToEachOther
                ? index + (overflowRef.children.item(index)?.clientWidth || 0)
                : index * overflowRef.offsetWidth

            overflowRef.style.transform = `translate(-${newScrollValue}px)`

            return this.setState({
                paginationIndex: index,
                scrollValue: -newScrollValue
            })
        }

        if (overflowRef && paginationIndex > 0) {
            const index = paginationIndex - 1
            const newScrollValue = this.props.paginationConfig?.withScroll || this.props.paginationConfig?.renderNextToEachOther
                ? scrollValue + (overflowRef.children.item(index)?.clientWidth || 0)
                : scrollValue + overflowRef.offsetWidth

            overflowRef.style.transform = `translate(${newScrollValue}px)`

            return this.setState({
                paginationIndex: index,
                scrollValue: newScrollValue
            })
        }
    }

    onDotClick(index: number) {
        const overflowRef = this.overflowContainerRef.current
        const { paginationIndex } = this.state
        const { paginationConfig } = this.props

        if (overflowRef && paginationConfig && (paginationConfig?.withScroll || paginationConfig?.renderNextToEachOther)) {
            const newScrollValue = (overflowRef?.children.item(index) as HTMLDivElement)?.offsetLeft || 0

            overflowRef.scroll({
                left: newScrollValue,
                top: 0,
                behavior: 'smooth'
            })

            return this.setState({
                paginationIndex: index
            })
        }

        if (overflowRef && index !== paginationIndex) {
            const newScrollValue = this.props.paginationConfig?.withScroll || this.props.paginationConfig?.renderNextToEachOther
                ? -((overflowRef?.children.item(index) as HTMLDivElement)?.offsetLeft || 0)
                : -(index * overflowRef.clientWidth)

            overflowRef.style.transform = `translate(${newScrollValue}px)`

            this.setState({
                paginationIndex: index,
                scrollValue: newScrollValue
            })
        }
    }

    onOverflowContentMouseDown(event: React.MouseEvent) {
        event.preventDefault()

        const overflowRef = this.overflowContainerRef.current
        const { paginationConfig }  = this.props

        if (overflowRef && paginationConfig && paginationConfig.draggable) {
            overflowRef.style.transition = 'unset'
            overflowRef.style.transform = `translate(${this.state.scrollValue}px)`

            this.setState({
                deltaX: event.clientX,
                scrollLeft: this.state.scrollValue,
                dragScroll: this.state.scrollValue
            })

            window.addEventListener('mousemove', this.onOverflowContentDrag)
            window.addEventListener('mouseup', this.deleteOverflowMouseMoveEvent)
        }
    }

    onOverflowContentDrag(event: MouseEvent) {
        const { deltaX, scrollLeft } = this.state
        const overflowRef = this.overflowContainerRef.current
        const dragScroll = scrollLeft + (event.clientX - deltaX)

        if (overflowRef && event.clientX !== 0) {
            overflowRef.style.transform = `translate(${dragScroll}px)`

            this.setState({
                dragScroll
            })
        }
    }

    onTouchStart(event: React.TouchEvent) {
        const { scrollValue } = this.state
        const touch = event.touches.item(0) as Touch
        const overflowRef = this.overflowContainerRef.current

        this.setState({
            deltaX: touch.clientX,
            scrollLeft: scrollValue,
            dragScroll: scrollValue,
            deltaY: touch.clientY,
            horizontal: false,
            lockedMove: false
        })

        if (overflowRef) {
            overflowRef.style.transition = 'unset'
        }

        this.overflowContainerRef.current?.addEventListener('touchmove', this.onTouchMove, { passive: false })
        this.overflowContainerRef.current?.addEventListener('touchend', this.deleteOverflowMouseMoveEvent)
    }

    onTouchMove(event: TouchEvent) {
        const { deltaX, scrollLeft, deltaY, horizontal, lockedMove } = this.state
        const touch = event.touches.item(0) as Touch
        const overflowRef = this.overflowContainerRef.current
        const dragScroll = scrollLeft + (touch.clientX - deltaX)
        const { paginationConfig } = this.props
        const minOffset = paginationConfig?.minOffsetToChangeSlide || 50

        if (!horizontal && lockedMove) {
            return null
        }

        if (Math.abs(touch.clientY - deltaY) > minOffset && !lockedMove) {
            this.setState({
                horizontal: false,
                lockedMove: true
            })
        }

        if (Math.abs(touch.clientX - deltaX) > minOffset && !lockedMove) {
            this.setState({
                horizontal: true,
                lockedMove: true
            })
        }

        if (Math.abs(touch.clientX - deltaX) > minOffset) {
            event.preventDefault()
        }

        if (overflowRef && touch.clientX !== 0) {
            overflowRef.style.transform = `translate(${dragScroll}px)`

            this.setState({
                dragScroll
            })
        }

        return
    }

    deleteOverflowMouseMoveEvent() {
        const overflowRef = this.overflowContainerRef.current
        const { dragScroll, paginationIndex, scrollLeft } = this.state
        const { paginationConfig } = this.props
        const minOffset = paginationConfig?.minOffsetToChangeSlide || 150
        const transition = paginationConfig?.transitionTime || 1

        if (overflowRef && (-scrollLeft + dragScroll < -minOffset)) {
            const numCols = this.props.numCols || 1
            const isLastSlide = paginationIndex === Math.ceil(this.childrenCount / numCols) - 1
            const newValue = isLastSlide
                ? paginationIndex * overflowRef.clientWidth
                : (paginationIndex + 1) * overflowRef.clientWidth

            overflowRef.style.transition = `all ${transition}s`
            overflowRef.style.transform = `translate(-${newValue}px)`

            this.setState({
                paginationIndex: isLastSlide ? paginationIndex : paginationIndex + 1,
                scrollValue: -newValue
            })
        }

        if (overflowRef && (-scrollLeft + dragScroll > minOffset)) {
            const isFirstSlide = paginationIndex === 0
            const newValue = isFirstSlide
                ? 0
                : (paginationIndex - 1) * overflowRef.clientWidth

            overflowRef.style.transition = `all ${transition}s`
            overflowRef.style.transform = `translate(-${newValue}px)`

            this.setState({
                paginationIndex: isFirstSlide ? paginationIndex : paginationIndex - 1,
                scrollValue: -newValue
            })
        }

        const shouldReturn = C.all(
            overflowRef,
            -scrollLeft + dragScroll > -minOffset,
            -scrollLeft + dragScroll < minOffset
        )

        if (shouldReturn) {
            overflowRef!.style.transition = `all ${transition}s`
            overflowRef!.style.transform = `translate(-${paginationIndex * overflowRef!.clientWidth}px)`
        }

        window.removeEventListener('mousemove', this.onOverflowContentDrag)
        window.removeEventListener('mouseup', this.deleteOverflowMouseMoveEvent)
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
            const width = (this.props.paginationConfig?.withScroll || this.props.paginationConfig?.renderNextToEachOther) ? 'unset' : '100%'

            return (
                <ChildrenWrapper
                    id={`${constants.reactSmartScrollerId}-${index}`}
                    style={{
                        padding: `0 ${padding}px`,
                        flexBasis,
                        paddingRight,
                        paddingLeft,
                        width
                    }}
                >
                    {child}
                </ChildrenWrapper>
            )
        })
    }

    renderDots() {
        const { paginationConfig } = this.props

        return Array.from(Array(this.numberOfViews)).map((_, index) => {
            const backgroundColor = this.state.paginationIndex === index
                ? paginationConfig?.activeDotColor || colors.primary
                : paginationConfig?.unactiveDotsColor || colors.gray.mediumGray

            return (
                <Dot
                    key={index}
                    style={{ backgroundColor }}
                    onClick={() => this.onDotClick(index)}
                />
            )
        })
    }

    renderPagination() {
        const { renderPagination, paginationConfig } = this.props
        const customStyles = paginationConfig?.withScroll ? {
            marginTop: 20
        } as React.CSSProperties : {
            marginTop: 'unset'
        } as React.CSSProperties

        if (renderPagination) {
            return renderPagination({
                selectedDot: this.state.paginationIndex,
                onPrev: this.onPrevious,
                onNext: this.onNext,
                childrenCount: this.childrenCount,
                onDotClick: this.onDotClick
            })
        }

        return (
            <Pagination style={customStyles}>
                <LeftArrow onClick={this.onPrevious}/>
                {this.renderDots()}
                <RightArrow onClick={this.onNext}/>
            </Pagination>
        )
    }

    onOverflowContentScroll() {
        const overflowRef = this.overflowContainerRef.current
        const leftScroll = overflowRef?.scrollLeft || 0
        const properChildrenOffsets = this.childrenWidth?.reduce((acc, element, index) => {
            return acc.concat({
                index: index + 1,
                value: element.value + (acc[index - 1]?.value || 0)
            })
        }, [] as Array<{ value: number, index: number }>)
        const searchedElement = properChildrenOffsets?.reverse()?.find(item => leftScroll >= item.value)

        this.setState({
            paginationIndex: searchedElement
                ? searchedElement.index
                : 0
        })
    }

    render() {
        const { paginationConfig, style } = this.props
        const transition = paginationConfig?.transitionTime || 1
        const customStyles = paginationConfig?.withScroll ? {
            overflowX: 'auto',
            marginBottom: -20
        } as React.CSSProperties : {
            overflowX: 'unset',
            marginBottom: 'unset'
        } as React.CSSProperties

        return (
            <ContainerWrapper style={style}>
                <Container
                    ref={this.overflowContainerRef}
                    style={{
                        transition: `all ${transition}s`,
                        flex: 1,
                        ...customStyles
                    }}
                    onScroll={this.onOverflowContentScroll}
                    onMouseDown={isMobile() ? C.noop : this.onOverflowContentMouseDown}
                    onTouchStart={isMobile() ? this.onTouchStart : C.noop}
                >
                    {this.renderChildren()}
                </Container>
                {this.renderPagination()}
            </ContainerWrapper>
        )
    }
}

export const ContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export const Container = styled.div`
  display: flex;
  position: relative;
  -webkit-overflow-scrolling: touch;
`

export const ChildrenWrapper = styled.div`
  flex: 0 0 auto;
  box-sizing: border-box;
`

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
`

export const LeftArrow = styled.div`
  border: solid ${colors.black};
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 6px;
  transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
  cursor: pointer;
`

export const RightArrow = styled.div`
  border: solid ${colors.black};
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 6px;
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  cursor: pointer;
`

export const Dot = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin: 0 3px;
  cursor: pointer;
`
