import React from 'react'
import { Noop } from '../types'

export type RenderPaginationProps = {
    onNext: Noop,
    onPrev: Noop,
    selectedDot: number,
    childrenCount: number,
    onDotClick(index: number): void
}

export type ReactSmartScrollerProps = {
    numCols?: number,
    spacing?: number,
    trackProps?: React.CSSProperties,
    thumb?: JSX.Element,
    vertical?: boolean,
    draggable?: boolean,
    pagination?: boolean,
    paginationConfig?: {
        infinite?: boolean,
        unactiveDotsColor?: string,
        activeDotColor?: string,
        transitionTime?: number,
        minOffsetToChangeSlide?: number
    },
    renderPagination?(options: RenderPaginationProps): JSX.Element
}
