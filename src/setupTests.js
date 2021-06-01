import { configure } from 'enzyme';
import ReactSixteenAdapter from 'enzyme-adapter-react-16';
const { JSDOM } = require('jsdom');
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;
window.Object = Object;
window.Math = Math;
global.window = window;
global.document = window.document;
global.navigator = {
    userAgent: 'node.js',
};
function copyProps(src, target) {
    const props = Object.getOwnPropertyNames(src)
        .filter(prop => typeof target[prop] === 'undefined')
        .reduce((result, prop) => ({
        ...result,
        [prop]: Object.getOwnPropertyDescriptor(src, prop),
    }), {});
    Object.defineProperties(target, props);
}
const matchMediaPolyfill = () => ({
    matches: false,
    addListener: () => { },
    removeListener: () => { }
});
window.matchMedia = window.matchMedia || matchMediaPolyfill;
copyProps(window, global);
configure({ adapter: new ReactSixteenAdapter() });
