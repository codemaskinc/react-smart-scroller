export type KeyValuePair = {
    [key: string]: any // tslint:disable-line no-any
}

export interface Global extends NodeJS.Global {
    document: Document,
    window: Window,
    navigator: {
        userAgent: string
    }
}

export type Noop = () => void
