export const colors = {
    primary: '#2ecc71',
    secondary: '#27ae60',
    typography: '#2c3e50',
    red: '#e74c3c',
    white: '#ffffff',
    black: '#000000',
    peterRiver: '#3498db',
    sunflower: '#f1c40f',
    gray: {
        lightGray: '#ecf0f1',
        mediumGray: '#bdc3c7',
        darkGray: '#9ca2a7',
    },
    customWhiteTransparent: (opacity: number) => `rgba(255, 255, 255, ${opacity})`,
    customBlackTransparent: (opacity: number) => `rgba(0, 0, 0, ${opacity})`,
    hexToRGBA: (hex: string, opacity: number) => hex
        .replace('#', '')
        .split(/(?=(?:..)*$)/)
        .map(x => parseInt(x, 16))
        .filter(num => !isNaN(num))
        .reduce((acc, color) => `${acc}${color},`, 'rgba(')
        .concat(`${opacity})`)
}
