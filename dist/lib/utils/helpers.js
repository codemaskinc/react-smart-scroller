import { PaddingCount } from '../common';
// tslint:disable-next-line:no-any
const all = (...params) => params.every(Boolean);
const clearObject = (value) => Object
    .keys(value)
    .filter(key => Boolean(value[key]))
    .reduce((acc, curr) => ({
    ...acc,
    [curr]: value[curr]
}), {});
export { clearObject, all };
export const extractNumberFromStyle = (value) => Number(value.replace('px', ''));
export const getPaddingValues = (padding, paddingLeft, paddingRight) => {
    if (!padding && !paddingLeft && !paddingRight) {
        return null;
    }
    const zeroPadding = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };
    if (!padding && paddingLeft && paddingRight) {
        return {
            ...zeroPadding,
            right: extractNumberFromStyle(paddingRight.toString()),
            left: extractNumberFromStyle(paddingLeft.toString())
        };
    }
    if (!padding && paddingLeft) {
        return {
            ...zeroPadding,
            left: extractNumberFromStyle(paddingLeft.toString())
        };
    }
    if (!padding && paddingRight) {
        return {
            ...zeroPadding,
            right: extractNumberFromStyle(paddingRight.toString())
        };
    }
    const splittedPadding = padding ? padding.toString().split(' ') : [];
    const paddingValuesCount = splittedPadding.length;
    const paddingValues = splittedPadding.map(extractNumberFromStyle);
    switch (paddingValuesCount) {
        case PaddingCount.One: {
            const [padding] = paddingValues;
            return {
                top: padding,
                right: padding,
                bottom: padding,
                left: padding
            };
        }
        case PaddingCount.Two: {
            const [paddingVertical, paddingHorizontal] = paddingValues;
            return {
                top: paddingVertical,
                right: paddingHorizontal,
                bottom: paddingVertical,
                left: paddingHorizontal
            };
        }
        case PaddingCount.Three: {
            const [paddingTop, paddingHorizontal, paddingBottom] = paddingValues;
            return {
                top: paddingTop,
                right: paddingHorizontal,
                bottom: paddingBottom,
                left: paddingHorizontal
            };
        }
        case PaddingCount.Four:
        default: {
            const [top, right, bottom, left] = paddingValues;
            return {
                top,
                right,
                bottom,
                left
            };
        }
    }
};
