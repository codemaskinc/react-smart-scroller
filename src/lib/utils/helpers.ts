import { KeyValuePair } from '../types'
import { PaddingCount } from '../common'

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

export const extractNumberFromStyle = (value: string | number) => Number(value.toString().replace('px', ''))

export const getPaddingValues = (
    padding?: string | number,
    paddingLeft?: string | number,
    paddingRight?: string | number,
    paddingTop?: string | number,
    paddingBottom?: string | number
) => {
    if (!padding && !paddingLeft && !paddingRight && !paddingTop && paddingBottom) {
        return null
    }

    const zeroPadding = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    }

    if (!padding) {
        return {
            ...zeroPadding,
            right: paddingRight ? extractNumberFromStyle(paddingRight) : undefined,
            left: paddingLeft ? extractNumberFromStyle(paddingLeft) : undefined,
            top: paddingTop ? extractNumberFromStyle(paddingTop) : undefined,
            bottom: paddingBottom ? extractNumberFromStyle(paddingBottom) : undefined
        }
    }

    const splittedPadding = padding ? padding.toString().split(' ') : []
    const paddingValuesCount = splittedPadding.length
    const paddingValues = splittedPadding.map(extractNumberFromStyle)

    switch (paddingValuesCount) {
        case PaddingCount.One: {
            const [ padding ] = paddingValues

            return {
                top: padding,
                right: padding,
                bottom: padding,
                left: padding
            }
        }
        case PaddingCount.Two: {
            const [ paddingVertical, paddingHorizontal ] = paddingValues

            return {
                top: paddingVertical,
                right: paddingHorizontal,
                bottom: paddingVertical,
                left: paddingHorizontal
            }
        }
        case PaddingCount.Three: {
            const [ paddingTop, paddingHorizontal, paddingBottom ] = paddingValues

            return {
                top: paddingTop,
                right: paddingHorizontal,
                bottom: paddingBottom,
                left: paddingHorizontal
            }
        }
        case PaddingCount.Four:
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
