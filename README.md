<p align="center">
    <img src="assets/react-smart-scroller.png" width="400"/>
</p>

## <a href='https://coveralls.io/github/codegateinc/react-smart-scroller?branch=feature/Scroller'><img src='https://coveralls.io/repos/github/codegateinc/react-smart-scroller/badge.svg?branch=feature/Scroller' alt='Coverage Status' /></a> <a href='https://github.com/styled-components/styled-components'><img src='https://img.shields.io/badge/style-%F0%9F%92%85%20styled--components-orange.svg?colorB=daa357&colorA=db748e' alt='styled compoennts' /></a> <a href='https://www.typescriptlang.org/'><img src='https://badges.frapsoft.com/typescript/code/typescript.png?v=101' alt='typescript' height=20/></a> <a href='http://opensource.org/licenses/MIT'><img src='http://img.shields.io/badge/license-MIT-brightgreen.svg' alt='MIT' /></a> <a href="https://badge.fury.io/js/react-smart-scroller"><img src="https://badge.fury.io/js/react-smart-scroller.svg" alt="npm version"></a>

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

<p align="center">
  <img src="assets/react-smart-scroller-demo-default.gif" />
</p>

### [Live demo](https://codesandbox.io/embed/dark-cookies-gvh6p)

## Install
`yarn add react-smart-scroller` or `npm install --save react-smart-scroller`

## Props

Property      | Type                | Description
------------- | ------------------- | ------------------------
numCols       | number              | Default: `undefined`.<br> Number of columns per container width.<br>If 1, width of each child is 100%.<br>If not provided, column has childs width.
spacing       | number              | Default: `0`.<br> Space in pixels between elements.
trackProps    | React.CssProperties | Default: `undefined`.<br> CSS styles to original track.
thumb         | JSX.Element         | Default: `rectangle`.<br> Element that if provided overrides default rectangle.
vertical      | boolean             | Default: `false`.<br> Defines direction of scrollbar - horizontal by default.<br>If height of ReactSmartScroller is not defined it will automatically resize to 100% and scroll will not be visible. 
draggable     | boolean             | Default: `false`.<br> Allows to scroll by dragging content.

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
  <img src="assets/react-smart-scroller-usage-basic.png" />
</p>

### numCols

    export const Slider = () => (
        <ReactSmartScroller numCols={3}>
            {renderImages()}
        </ReactSmartScroller>
    )

<p align="center">
  <img src="assets/react-smart-scroller-usage-numCols.png" />
</p>

### spacing

    export const Slider = () => (
        <ReactSmartScroller spacing={24}>
            {renderImages()}
        </ReactSmartScroller>
    )
    
<p align="center">
    <img src="assets/react-smart-scroller-usage-spacing.png" />
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
    <img src="assets/react-smart-scroller-usage-trackProps.png" />
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
    <img src="assets/react-smart-scroller-usage-thumb.png" />
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
    <img src="assets/react-smart-scroller-usage-vertical.png" />
</p>

### draggable

    export const Slider = () => (
        <ReactSmartScroller draggable>
            {renderImages()}
        </ReactSmartScroller>
    )
    
<p align="center">
    <img src="assets/react-smart-scroller-usage-draggable.gif" />
</p>

## todo

- [x] thumb width dependent on scrollWidth
- [x] vertical scroll
- [x] vertical scroll tests
- [x] improve documentation
- [x] more examples in usage
- [x] enable drag with mouse
