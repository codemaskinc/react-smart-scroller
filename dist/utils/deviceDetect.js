export const isIpad = () => navigator.userAgent.includes('iPad');
export const isIOS = () => navigator.userAgent.includes('iPhone') || isIpad();
export const isAndroid = () => navigator.userAgent.includes('Android');
export const isMobile = () => isAndroid() || isIOS();
export const isMsEdge = () => navigator.userAgent.includes('Edge');
export const isMacOs = () => navigator.userAgent.includes('Mac');
