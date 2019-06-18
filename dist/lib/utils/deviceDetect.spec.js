import { isIOS, isAndroid, isMobile, isMsEdge } from "./deviceDetect";

const mockConfig = device => ({
  value: device,
  configurable: true
});

const agent = 'userAgent';
describe('utils: deviceDetect', () => {
  it('should return corresponding values for Android device', () => {
    Object.defineProperty(window.navigator, agent, mockConfig('Android'));
    expect(isIOS()).toEqual(false);
    expect(isAndroid()).toEqual(true);
    expect(isMobile()).toEqual(true);
  });
  it('should return corresponding values for iOS device', () => {
    Object.defineProperty(window.navigator, agent, mockConfig('iPhone'));
    expect(isIOS()).toEqual(true);
    expect(isAndroid()).toEqual(false);
    expect(isMobile()).toEqual(true);
  });
  it('should return corresponding values for iPad', () => {
    Object.defineProperty(window.navigator, agent, mockConfig('iPad'));
    expect(isIOS()).toEqual(true);
    expect(isAndroid()).toEqual(false);
    expect(isMobile()).toEqual(true);
  });
  it('should return false for unmated platforms', () => {
    Object.defineProperty(window.navigator, agent, {
      value: ''
    });
    expect(isIOS()).toEqual(false);
    expect(isAndroid()).toEqual(false);
    expect(isMobile()).toEqual(false);
  });
  it('should return true for Edge browser', () => {
    Object.defineProperty(window.navigator, agent, mockConfig('Edge'));
    expect(isMsEdge()).toEqual(true);
  });
});