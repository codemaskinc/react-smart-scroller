<p align="center">
    <img src="https://cdn.codegate.pl/react-smart-scroller/react-smart-scroller.png" width="400"/>
</p>

## <a href='https://coveralls.io/github/codegateinc/react-smart-scroller?branch=master'><img src='https://coveralls.io/repos/github/codegateinc/react-smart-scroller/badge.svg?branch=master' alt='Coverage Status' /></a> <a href='https://github.com/styled-components/styled-components'><img src='https://img.shields.io/badge/style-%F0%9F%92%85%20styled--components-orange.svg?colorB=daa357&colorA=db748e' alt='styled compoennts' /></a> <a href='https://www.typescriptlang.org/'><img src='https://badges.frapsoft.com/typescript/code/typescript.png?v=101' alt='typescript' height=20/></a> <a href='http://opensource.org/licenses/MIT'><img src='http://img.shields.io/badge/license-MIT-brightgreen.svg' alt='MIT' /></a> <a href="https://badge.fury.io/js/react-smart-scroller"><img src="https://badge.fury.io/js/react-smart-scroller.svg" alt="npm version"></a>

React-smart-scroller is a library that allows you to create highly customizable horizontal or vertical scroller in easy way.

You can modify scrollbar track just like you want, adding some styles to it, and change look of
scrollbar thumb just simply passing styled JSX Element.

Define your own spacing or columns per scroller width simply passing props.

### Features

- Full responsiveness
- Every child is resized dependent on view cols
- Highly customizable track
- Possibility of passing own thumb (own component)
- Vertical scroll
- Spacing between columns
- Draggable content
- Well typed (Typescript)
- Server Side Rendering friendly
- Horizontal Slider with arrows and dots

<p align="center">
  <img src="https://cdn.codegate.pl/react-smart-scroller/react-smart-scroller-demo-default.gif" />
</p>

### [Live demo](https://codesandbox.io/embed/quizzical-lalande-tj4uq)

## Install
`yarn add react-smart-scroller` or `npm install --save react-smart-scroller`

## Props

Property         | Type                                                     | Description
---------------- | ------------------------------------------------------   | ------------------------
numCols          | number                                                   | Default: `undefined`.<br> Number of columns per container width.<br>If 1, width of each child is 100%.<br>If not provided, column has childs width.
style            | React.CssProperties                                      | Default: `undefined`.<br> Custom styles applied to wrapper.
spacing          | number                                                   | Default: `0`.<br> Space in pixels between elements.
trackProps       | React.CssProperties                                      | Default: `undefined`.<br> CSS styles to original track.
thumb            | JSX.Element                                              | Default: `rectangle`.<br> Element that if provided overrides default rectangle.
vertical         | boolean                                                  | Default: `false`.<br> Defines direction of scrollbar - horizontal by default.<br>If height of ReactSmartScroller is not defined it will automatically resize to 100% and scroll will not be visible. 
draggable        | boolean                                                  | Default: `false`.<br> Allows to scroll by dragging content.
pagination       | boolean                                                  | Default: `false`.<br> Renders Slider with children, arrowRight, arrowLeft and dots (number of dots same as children length)
startAt          | {<br>&nbsp;startIndex: number<br>&nbsp;center?: boolean<br>}| Default: `undefined`.<br> Defines start position of scroller (index of element)
paginationConfig | {<br>&nbsp; infinite?: boolean,<br>&nbsp; unactiveDotsColor?: string,<br>&nbsp; activeDotColor?: string,<br>&nbsp; transitionTime?: number,<br>&nbsp; minOffsetToChangeSlide?: number,<br>&nbsp; draggable?: boolean,<br>withScroll?: boolean<br>} | Default: `undefined`.<br> `infinite` is optional boolean that allows user to scroll to first element from lsat after clicking next and in opposite way<br> `uncativeDotsColor` is optional string that defines unactive color of dots, default: `gray`<br> `activeDotColor` is optional string that defines active color of dot, default: `green`<br> `transitionTime` is optional number that sets transition time between slides Default: `1s` <br>`minOffsetToChangeSlide` is optional number that defines minimal offset needed to change slide in pixels Default: `150px`<br> `draggable` is optional boolean that enables switching slides by dragging them Default: `false`<br>`withScroll` is optional boolean that enables -> for horizontal scroll pagination and for pagination scrollable inner wrapper<br>`renderNextToEachOther` is optional boolean that enables to render children next to each other
renderPagination | ({<br>&nbsp; selectedDot: number,<br>&nbsp; childrenCount: number,<br>&nbsp; onNext(): void,<br>&nbsp; onPrev(): void,<br>&nbsp; onDotClick(index: number): void<br>}) => JSX.Element | Default: `undefined`.<br> Replaces original pagination, first element is arrowLeft and last element is arrowRight, elements in between are 'dots'<br> `selectedDot` is an index of selectedDot<br> `childrenCount` number of children  <br>`onNext` function that triggers next slide<br> `onPrev` function that triggers previous slide<br> `onDotClick` is a function that requires index of clicked dot, triggers transition to selected slide

## Usage

### Basic

Let's create our first component

    import React from 'react'
    import { ReactSmartScroller } from 'react-smart-scroller'
    
    const renderImages = () => {
        const images = [
            'https://cdn.pixabay.com/photo/2019/06/02/00/46/chapel-4245437__340.jpg',
            'https://cdn.pixabay.com/photo/2017/08/22/22/36/cinque-terre-2670762__340.jpg',
            'https://cdn.pixabay.com/photo/2016/08/01/20/34/girl-1562091__340.jpg',
            'https://cdn.pixabay.com/photo/2013/09/26/23/23/glitter-powder-186829__340.jpg',
            'https://cdn.pixabay.com/photo/2019/04/11/09/50/wave-4119274__340.jpg'
        ]
    
        return images.map((image, index) => (
            <img
                key={index}
                src={image}
                style={{
                    width: '100%',
                    height: 300,
                    objectFit: 'cover'
                }}
            />
        ))
    }
    
    export const Slider = () => (
        <ReactSmartScroller>
            {renderImages()}
        </ReactSmartScroller>
    )
    
This is what you'll see in your browser:

<p align="center">
  <img src="https://cdn.codegate.pl/react-smart-scroller/react-smart-scroller-usage-basic.png" />
</p>

### numCols

    export const Slider = () => (
        <ReactSmartScroller numCols={3}>
            {renderImages()}
        </ReactSmartScroller>
    )

<p align="center">
  <img src="https://cdn.codegate.pl/react-smart-scroller/react-smart-scroller-usage-numCols.png" />
</p>

### spacing

    export const Slider = () => (
        <ReactSmartScroller spacing={24}>
            {renderImages()}
        </ReactSmartScroller>
    )
    
<p align="center">
    <img src="https://cdn.codegate.pl/react-smart-scroller/react-smart-scroller-usage-spacing.png" />
</p>

### trackProps

    export const Slider = () => (
        <ReactSmartScroller
            trackProps={{
                height: 25
            }}
        >
            {renderImages()}
        </ReactSmartScroller>
    )
    
<p align="center">
    <img src="https://cdn.codegate.pl/react-smart-scroller/react-smart-scroller-usage-trackProps.png" />
</p>

### thumb

    export const Slider = () => (
        <ReactSmartScroller
            thumb={
                <div
                    style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: 'black'
                    }}
                />
            }
        >
            {renderImages()}
        </ReactSmartScroller>
    )
    
<p align="center">
    <img src="https://cdn.codegate.pl/react-smart-scroller/react-smart-scroller-usage-thumb.png" />
</p>

### vertical

    export const Slider = () => (
        <div
            style={{
                width: 500,
                height: 600
            }}
        >
            <ReactSmartScroller vertical>
                {renderImages()}
            </ReactSmartScroller>
        </div>
    )

<p align="center">
    <img src="https://cdn.codegate.pl/react-smart-scroller/react-smart-scroller-usage-vertical.png" />
</p>

### draggable

    export const Slider = () => (
        <ReactSmartScroller draggable>
            {renderImages()}
        </ReactSmartScroller>
    )
    
<p align="center">
    <img src="https://cdn.codegate.pl/react-smart-scroller/react-smart-scroller-usage-draggable.gif" />
</p>

### pagination

    export const Slider = () => (
        <ReactSmartScroller pagination>
            {renderImages()}
        </ReactSmartScroller>
    )
    
<p align="center">
    <img src="https://cdn.codegate.pl/react-smart-scroller/react-smart-scroller-pagination.png" />
</p>

### renderPagination

    const renderDots = (onDotClick: (index: number) => void, selectedDot: number) => images.map((value, index) => {
        const backgroundColor = selectedDot === index
            ? 'black'
            : 'gray'
    
        return (
            <Dot
                key={index}
                onClick={() => onDotClick(index)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill={backgroundColor} d="M144 268.4V358c0 6.9 4.5 14 11.4 14H184v52c0 13.3 10.7 24 24 24s24-10.7 24-24v-52h49v52c0 7.5 3.4 14.2 8.8 18.6 3.9 3.4 9.1 5.4 14.7 5.4h.5c13.3 0 24-10.7 24-24v-52h27.6c7 0 11.4-7.1 11.4-13.9V192H144v76.4zM408 176c-13.3 0-24 10.7-24 24v96c0 13.3 10.7 24 24 24s24-10.7 24-24v-96c0-13.3-10.7-24-24-24zM104 176c-13.3 0-24 10.7-24 24v96c0 13.3 10.7 24 24 24s24-10.7 24-24v-96c0-13.3-10.7-24-24-24z"/>
                    <g>
                        <path fill={backgroundColor} d="M311.2 89.1l18.5-21.9c.4-.5-.2-1.6-1.3-2.5-1.1-.8-2.4-1-2.7-.4l-19.2 22.8c-13.6-5.4-30.2-8.8-50.6-8.8-20.5-.1-37.2 3.2-50.8 8.5l-19-22.4c-.4-.5-1.6-.4-2.7.4s-1.7 1.8-1.3 2.5l18.3 21.6c-48.2 20.9-55.4 72.2-56.4 87.2h223.6c-.9-15.1-8-65.7-56.4-87zm-104.4 49.8c-7.4 0-13.5-6-13.5-13.3 0-7.3 6-13.3 13.5-13.3 7.4 0 13.5 6 13.5 13.3 0 7.3-6 13.3-13.5 13.3zm98.4 0c-7.4 0-13.5-6-13.5-13.3 0-7.3 6-13.3 13.5-13.3 7.4 0 13.5 6 13.5 13.3 0 7.3-6.1 13.3-13.5 13.3z"/>
                    </g>
                </svg>
            </Dot>
        )
    })

    const renderPagination = ({ onNext, onPrev, onDotClick, selectedDot }: RenderPaginationProps) => {
        return (
            <Wrapper>
                <LeftArrow
                    src={arrowLeft}
                    onClick={onPrev}
                />
                {renderDots(onDotClick, selectedDot)}
                <RightArrow
                    src={arrowRight}
                    onClick={onNext}
                />
            </Wrapper>
        )
    }

    export const Slider = () => (
        <ReactSmartScroller
            pagination
            renderPagination={renderPagination}
        >
            {renderImages()}
        </ReactSmartScroller>
    )
    
<p align="center">
    <img src="https://cdn.codegate.pl/react-smart-scroller/react-smart-scroller-pagination-renderPagination.gif" />
</p>

### paginationConfig

#### infinite

    export const Slider = () => (
        <ReactSmartScroller
            pagination
            paginationConfig={{
                infinite: true
            }}
        >
            {renderImages()}
        </ReactSmartScroller>
    )

<p align="center">
    <img src="https://cdn.codegate.pl/react-smart-scroller/react-smart-scroller-pagination-infinite.gif" />
</p>

#### draggable

    export const Slider = () => (
        <ReactSmartScroller
            pagination
            paginationConfig={{
                draggable: true
            }}
        >
            {renderImages()}
        </ReactSmartScroller>
    )

<p align="center">
    <img src="https://cdn.codegate.pl/react-smart-scroller/react-smart-scroller-pagination-draggable.gif" />
</p>

#### transitionTime

    export const Slider = () => (
        <ReactSmartScroller
            pagination
            paginationConfig={{
                transitionTime: 0.25
            }}
        >
            {renderImages()}
        </ReactSmartScroller>
    )

<p align="center">
    <img src="https://cdn.codegate.pl/react-smart-scroller/react-smart-scroller-pagination-transitionTime.gif" />
</p>

#### minOffsetToChangeSlide

    export const Slider = () => (
        <ReactSmartScroller
            pagination
            paginationConfig={{
                minOffsetToChangeSlide: 25
            }}
        >
            {renderImages()}
        </ReactSmartScroller>
    )

#### unactiveDotsColor

    export const Slider = () => (
        <ReactSmartScroller
            pagination
            paginationConfig={{
                unactiveDotsColor: 'gray'
            }}
        >
            {renderImages()}
        </ReactSmartScroller>
    )

#### activeDotsColor

    export const Slider = () => (
        <ReactSmartScroller
            pagination
            paginationConfig={{
                activeDotColor: 'red'
            }}
        >
            {renderImages()}
        </ReactSmartScroller>
    )
