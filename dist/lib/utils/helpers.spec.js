import { clearObject } from "./helpers";
describe('utils: clearObject', () => {
  it('should return object without undefined fields', () => {
    const inputObject = {
      a: 'a',
      b: undefined,
      c: 3
    };
    const expectedObject = {
      a: 'a',
      c: 3
    };
    const undefinedObject = {
      a: undefined
    };
    expect(clearObject(inputObject)).toEqual(expectedObject);
    expect(clearObject(undefinedObject)).toEqual({});
  });
});