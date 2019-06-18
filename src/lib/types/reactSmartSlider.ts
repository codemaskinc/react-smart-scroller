import React from 'react'
import { ScrollDirection } from '../common'

export type ReactSmartSliderProps = {
    numCols?: number,
    spacing?: number,
    trackProps?: React.CSSProperties,
    thumb?: JSX.Element,
    scrollDirection: ScrollDirection
}
