import React from 'react';
import styled from 'styled-components';
import { isServer } from 'lib/utils';
import { ReactSmartScrollerVertical } from './ReactSmartScrollerVertical';
import { ReactSmartScrollerHorizontal } from './ReactSmartScrollerHorizontal';
import { ReactSmartScrollerPagination } from './ReactSmartScrollerPagination';
export class ReactSmartScroller extends React.Component {
    renderMain() {
        if (this.props.pagination) {
            return (React.createElement(ReactSmartScrollerPagination, Object.assign({}, this.props)));
        }
        return this.props.vertical ? (React.createElement(ReactSmartScrollerVertical, Object.assign({}, this.props))) : (React.createElement(ReactSmartScrollerHorizontal, Object.assign({}, this.props)));
    }
    render() {
        return !isServer() ? (React.createElement(Wrapper, null, this.renderMain())) : null;
    }
}
export const Wrapper = styled.div `
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
`;
