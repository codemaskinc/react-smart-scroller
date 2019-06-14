import { KeyValuePair } from '../types'

// tslint:disable-next-line:no-any
const all = (...params: Array<any>) => params.every(Boolean)
const clearObject = (value: KeyValuePair) => Object
    .keys(value)
    .filter(key => Boolean(value[key]))
    .reduce((acc, curr) => ({
        ...acc,
        [curr]: value[curr]
    }), {})

export {
    clearObject,
    all
}

export const extractNumberFromStyle = (value: string) => Number(value.replace('px', ''))

export const getPaddingValues = (padding?: string | number, paddingLeft?: string | number, paddingRight?: string | number) => {
    if (!padding && !paddingLeft && !paddingRight) {
        return null
    }

    if (!padding && paddingLeft && paddingRight) {
        return {
            top: 0,
            right: extractNumberFromStyle(paddingRight.toString()),
            bottom: 0,
            left: extractNumberFromStyle(paddingLeft.toString())
        }
    }

    if (!padding && paddingLeft) {
        return {
            top: 0,
            right: 0,
            bottom: 0,
            left: extractNumberFromStyle(paddingLeft.toString())
        }
    }

    if (!padding && paddingRight) {
        return {
            top: 0,
            right: extractNumberFromStyle(paddingRight.toString()),
            bottom: 0,
            left: 0
        }
    }

    const splittedPadding = padding ? padding.toString().split(' ') : []
    const paddingValuesCount = splittedPadding.length
    const paddingValues = splittedPadding.map(extractNumberFromStyle)

    switch (paddingValuesCount) {
        case 1: {
            const [ padding ] = paddingValues

            return {
                top: padding,
                right: padding,
                bottom: padding,
                left: padding
            }
        }
        case 2: {
            const [ paddingVertical, paddingHorizontal ] = paddingValues

            return {
                top: paddingVertical,
                right: paddingHorizontal,
                bottom: paddingVertical,
                left: paddingHorizontal
            }
        }
        case 3: {
            const [ paddingTop, paddingHorizontal, paddingBottom ] = paddingValues

            return {
                top: paddingTop,
                right: paddingHorizontal,
                bottom: paddingBottom,
                left: paddingHorizontal
            }
        }
        default: {
            const [ top, right, bottom, left ] = paddingValues

            return {
                top,
                right,
                bottom,
                left
            }
        }
    }
}
