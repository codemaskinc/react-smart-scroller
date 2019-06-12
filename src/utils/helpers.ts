import { KeyValuePair } from '../types'

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
