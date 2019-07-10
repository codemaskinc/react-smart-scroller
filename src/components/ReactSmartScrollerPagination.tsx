import React from 'react'
import styled from 'styled-components'
import { ReactSmartScrollerProps } from 'lib/types'
import { colors } from 'lib/styles'

type ReactSmartScrollerPaginationState = {
    numberOfViews: number,
    paginationIndex: number,
    scrollValue: number
}

export class ReactSmartScrollerPagination extends React.Component<ReactSmartScrollerProps, ReactSmartScrollerPaginationState> {
    state: ReactSmartScrollerPaginationState = {
        paginationIndex: 0,
        numberOfViews: 0,
        scrollValue: 0
    }

    private overflowContainerRef: React.RefObject<HTMLDivElement> = React.createRef()

    constructor(props: ReactSmartScrollerProps) {
        super(props)

        this.onNext = this.onNext.bind(this)
        this.onPrevious = this.onPrevious.bind(this)
    }

    componentDidMount() {
        this.setState({
            numberOfViews: this.numberOfViews
        })
    }

    get numberOfViews() {
        const overflowRef = this.overflowContainerRef.current

        if (overflowRef) {
            return Math.ceil(overflowRef.scrollWidth / overflowRef.clientWidth)
        }

        return 1
    }

    get childrenCount() {
        return React.Children.count(this.props.children)
    }

    onNext() {
        const overflowRef = this.overflowContainerRef.current
        const { paginationIndex, scrollValue } = this.state

        if (overflowRef && paginationIndex < this.childrenCount - 1) {
            const newScrollValue = scrollValue - overflowRef.offsetWidth
            const index = scrollValue + overflowRef.offsetWidth >= overflowRef.scrollWidth
                ? paginationIndex
                : paginationIndex + 1

            overflowRef.style.transform = `translate(${newScrollValue}px)`

            this.setState({
                paginationIndex: index,
                scrollValue: newScrollValue
            })
        }
    }

    onPrevious() {
        const overflowRef = this.overflowContainerRef.current
        const { paginationIndex, scrollValue } = this.state

        if (overflowRef && paginationIndex > 0) {
            const index = paginationIndex - 1
            const newScrollValue = scrollValue + overflowRef.offsetWidth

            overflowRef.style.transform = `translate(${newScrollValue}px)`

            this.setState({
                paginationIndex: index,
                scrollValue: newScrollValue
            })
        }
    }

    onDotClick(index: number) {
        const overflowRef = this.overflowContainerRef.current
        const { paginationIndex } = this.state

        if (overflowRef && index !== paginationIndex) {
            const newScrollValue = -(index * overflowRef.clientWidth)

            overflowRef.style.transform = `translate(${newScrollValue}px)`

            this.setState({
                paginationIndex: index,
                scrollValue: newScrollValue
            })
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
                        paddingLeft
                    }}
                >
                    {child}
                </ChildrenWrapper>
            )
        })
    }

    renderDots() {
        return Array.from(Array(this.childrenCount)).map((_, index) => {
            const backgroundColor = this.state.paginationIndex === index
                ? colors.primary
                : colors.gray.mediumGray

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
        return (
            <Pagination>
                <LeftArrow onClick={this.onPrevious}/>
                {this.renderDots()}
                <RightArrow onClick={this.onNext}/>
            </Pagination>
        )
    }

    render() {
        return (
            <ContainerWrapper>
                <Container ref={this.overflowContainerRef}>
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
    transition: all 1s;
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