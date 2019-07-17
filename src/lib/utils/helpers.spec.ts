import { clearObject, getPaddingValues, extractNumberFromStyle, all, noop } from './helpers'

describe('utils: clearObject', () => {
    it('should return object without undefined fields', () => {
        const inputObject = {
            a: 'a',
            b: undefined,
            c: 3
        }
        const expectedObject = {
            a: 'a',
            c: 3
        }
        const undefinedObject = {
            a: undefined
        }

        expect(clearObject(inputObject)).toEqual(expectedObject)
        expect(clearObject(undefinedObject)).toEqual({})
    })
})

describe('utils: all', () => {
    it('should return true', () => {
        expect(all(true, true)).toEqual(true)
    })

    it('should return false', () => {
        expect(all(true, false)).toEqual(false)
    })
})

describe('utils: noop', () => {
    it('should return empty function', () => {
        expect(noop()).toEqual(undefined)
    })
})

describe('utils: getPaddingValues', () => {
    it('should return null', () => {
        const outputValues = {
            bottom: 0,
            left: 0,
            right: 0,
            top: 0
        }

        expect(getPaddingValues()).toEqual(outputValues)
    })

    it('should return object with paddings', () => {
        const padding = undefined
        const left = 10
        const right = 10
        const top = 10
        const bottom = 10
        const outputValues = {
            bottom,
            left,
            right,
            top
        }

        expect(getPaddingValues(padding, left, right, top, bottom)).toEqual(outputValues)
    })

    it('should return object when padding with 1 props', () => {
        const padding = 10
        const outputValues = {
            bottom: padding,
            left: padding,
            right: padding,
            top: padding
        }

        expect(getPaddingValues(padding)).toEqual(outputValues)
    })

    it('should return object when padding with 2 props', () => {
        const verticalPadding = 10
        const horizontalPadding = 5
        const padding = `${verticalPadding}px ${horizontalPadding}px`
        const outputValues = {
            bottom: verticalPadding,
            left: horizontalPadding,
            right: horizontalPadding,
            top: verticalPadding
        }

        expect(getPaddingValues(padding)).toEqual(outputValues)
    })

    it('should return object when padding with 3 props', () => {
        const top = 10
        const bottom = 15
        const horizontalPadding = 5
        const padding = `${top}px ${horizontalPadding}px ${bottom}px`
        const outputValues = {
            bottom,
            left: horizontalPadding,
            right: horizontalPadding,
            top
        }

        expect(getPaddingValues(padding)).toEqual(outputValues)
    })

    it('should return object when padding with 4 props', () => {
        const top = 10
        const bottom = 15
        const left = 20
        const right = 25
        const padding = `${top}px ${right}px ${bottom}px ${left}px`
        const outputValues = {
            bottom,
            left,
            right,
            top
        }

        expect(getPaddingValues(padding)).toEqual(outputValues)
    })
})

describe('utils: extractNumberFromStyle', () => {
    it('should return Number when string with px given', () => {
        const digit = 10
        const styleNumber = `${digit}px`

        expect(extractNumberFromStyle(styleNumber)).toEqual(digit)
    })

    it('should return Number when number given', () => {
        const digit = 10

        expect(extractNumberFromStyle(digit)).toEqual(digit)
    })

    it('should return undefined when nothing provided', () => {
        expect(extractNumberFromStyle()).toEqual(undefined)
    })
})
