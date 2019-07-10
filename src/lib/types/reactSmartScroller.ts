import React from 'react'

export type ReactSmartScrollerProps = {
    numCols?: number,
    spacing?: number,
    trackProps?: React.CSSProperties,
    thumb?: JSX.Element,
    vertical?: boolean,
    draggable?: boolean,
    pagination?: boolean,
    paginationConfig?: {
        paginationDots?: number
    }
}
