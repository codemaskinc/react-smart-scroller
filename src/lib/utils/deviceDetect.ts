import { isServer } from './server'

export const checkAgent = (agentName: string) => !isServer()
    ? navigator.userAgent.includes(agentName)
    : false

export const isIpad = () => checkAgent('iPad')
export const isIOS = () => checkAgent('iPhone') || isIpad()
export const isAndroid = () => checkAgent('Android')
export const isMsEdge = () => checkAgent('Edge')
export const isMacOs = () => checkAgent('Mac')
export const isMobile = () => isAndroid() || isIOS()
