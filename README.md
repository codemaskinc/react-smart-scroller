# react-smart-slider

React-smart-slider is a library that allows you to create horizontal slider in easy way.

<p align="center">
  <img src="assets/react-smart-slider-demo-default.gif" />
</p>

### Features

- Horizontal scroll only
- Full responsiveness
- Every child is resized dependent of view cols

## Install
`yarn add react-smart-slider` or `npm install react-smart-slider`

## Props

Property      | Type          | Description
------------- | ------------- | ------------
numCols       | number        | Default: `undefined`.<br> Number of columns per container width.<br>If 1, width of each child is 100%.<br>If not provided, column has child width.
spacing       | number        | Default: `0`.<br> Space in pixels between elements.
trackProps    | CssProperties | Default: `undefined`.<br> Css styles to original track.
thumb         | Element       | Default: `rectangle`.<br> Element that if provided overrides default rectangle.

## Usage

Let's create our first component

    import React from 'react'
    import { ReactSmartSlider } from 'react-smart-slider'
    
    const renderImages = () => {
        const images = [
            'https://cdn.pixabay.com/photo/2019/06/02/00/46/chapel-4245437__340.jpg',
            'https://cdn.pixabay.com/photo/2017/08/22/22/36/cinque-terre-2670762__340.jpg',
            'https://cdn.pixabay.com/photo/2016/08/01/20/34/girl-1562091__340.jpg',
            'https://cdn.pixabay.com/photo/2013/09/26/23/23/glitter-powder-186829__340.jpg',
            'https://cdn.pixabay.com/photo/2019/04/11/09/50/wave-4119274__340.jpg'
        ]
    
        return images.map(image => (
            <img
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
        <ReactSmartSlider>
            {renderImages()}
        </ReactSmartSlider>
    )
    
This is what you'll see in your browser:

<p align="center">
  <img src="assets/react-smart-slider-usage-first.png" />
</p>

Now we can add some props to our Slider

    export const Slider = () => (
            <ReactSmartSlider
                numCols={3}
                spacing={24}
            >
                {renderImages()}
            </ReactSmartSlider>
        )

After setting above props we should see something like this:

<p align="center">
  <img src="assets/react-smart-slider-usage-second.gif" />
</p>

## todo

- [x] thumb width dependent on scrollWidth
- [x] vertical scroll
- [x] vertical scroll tests
- [ ] improve documentation
- [ ] more examples in usage
