import React from 'react'
import styled from 'styled-components'
import { ReactSmartScrollerProps } from 'lib/types'
import { isServer } from 'lib/utils'
import { ReactSmartScrollerVertical } from './ReactSmartScrollerVertical'
import { ReactSmartScrollerHorizontal } from './ReactSmartScrollerHorizontal'
import { ReactSmartScrollerPagination } from './ReactSmartScrollerPagination'

export class ReactSmartScroller extends React.Component<ReactSmartScrollerProps> {
    renderMain() {
        if (this.props.pagination) {
            return (
                <ReactSmartScrollerPagination {...this.props}/>
            )
        }

        return this.props.vertical ? (
            <ReactSmartScrollerVertical {...this.props}/>
        ) : (
            <ReactSmartScrollerHorizontal {...this.props}/>
        )
    }

    render() {
        return !isServer() ? (
            <Wrapper>
                {this.renderMain()}
            </Wrapper>
        ) : null
    }
}

export const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
`
