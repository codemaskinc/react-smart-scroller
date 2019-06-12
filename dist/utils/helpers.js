const all = (...params) => params.every(Boolean);
const clearObject = (value) => Object
    .keys(value)
    .filter(key => Boolean(value[key]))
    .reduce((acc, curr) => ({
    ...acc,
    [curr]: value[curr]
}), {});
export { clearObject, all };
