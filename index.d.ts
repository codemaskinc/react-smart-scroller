import React from 'react'

export type ReactSmartScrollerProps = {
    /**
        Default undefined.
        If given defines number of columns per container width.
        If 1, width of each child is 100%of container width.
        If not provided ( default ) width is inherited from children.
    */

    numCols?: number,

    /**
        Default 0.
        Defines space in pixels between columns.
        Spacing is based on padding of each element.
    */

    spacing?: number,

    /**
        Default undefined.
        Overrides base style of track.
    */

    trackProps?: React.CSSProperties,

    /**
        Default rectangle.
        Base rectangle element has adaptive width, dependent on length of children.
        Provided JSX.Element replaces original thumb.
    */

    thumb?: JSX.Element,

    /**
        Default false.
        Defines direction of scrollbar - horizontal in default.
        If true, it resize automatically.
        To avoid such behaviour define wrapper with targeted height,
        then ReactSmartSlider will take parent's height.
    */

    vertical?: boolean
}

export class ReactSmartScroller extends React.Component<ReactSmartScrollerProps> {}
