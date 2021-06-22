import React from 'react'

type PaginationConfig = {
    /**
        Default false.
        Enables infinite scroll, when last element and clicked next it returns to first element.
    */

    infinite?: boolean,

    /**
        Default gray.
        Color of unactive dot.
    */

    unactiveDotsColor?: string,

    /**
        Default green.
        Color of active dot.
    */

    activeDotColor?: string,

    /**
        Default 1s.
        Time of slide to slide animation in s.
    */

    transitionTime?: number,

    /**
        Default 50px.
        Distance needed to trigger next or previous slide after touch/mouse up.
    */

    minOffsetToChangeSlide?: number,

    /**
        Default false.
        Allows to drag each slide by mouse in web or by touch on mobile.
    */

    draggable?: boolean

    /**
        Default false.
        Allows to render elements next to each other
     */

    renderNextToEachOther?: boolean

    /**
        Default false.
        Allows scroll with pagination
    */

    withScroll?: boolean
}

type RenderPaginationProps = {
    /**
        returns index of active dot/identifier
    */

    selectedDot: number,

    /**
        returns number of children in slider
    */

    childrenCount: number,

    /**
        returns empty function that triggers transition to next slide (right arrow)
    */

    onNext(): void,

    /**
        returns empty function that triggers transition to previous slide (left arrow)
    */

    onPrev(): void,

    /**
        returns function that requires index of clicked dot/selector, invokes transition to clicked dot/selector
    */

    onDotClick(index: number): void
}

type StartAt = {
    /**
        Defines index of start element (scrolled to when componentDidMount)
    */

    startIndex: number,

    /**
        Defines alignment of start element
        If set to true, target element will be centered
    */

    center?: boolean
}

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

    vertical?: boolean,

    /**
        Default false.
        If set to true allows to scroll by dragging content.
    */

    draggable?: boolean,

    /**
        Default false.
        If set to true renders Slider.
    */

    pagination?: boolean,

    startAt?: StartAt,

    paginationConfig?: PaginationConfig,

    style?: React.CSSProperties,

    /**
        Function that renders custom arrows and currently selected element.
    */

    renderPagination?(options: RenderPaginationProps): JSX.Element
}

export class ReactSmartScroller extends React.Component<ReactSmartScrollerProps> {}
