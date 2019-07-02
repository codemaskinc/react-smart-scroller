module.exports = {
    "env": {
        "production": {
            "plugins": ["transform-remove-console"],
        },
    },
    "plugins": [
        ["module-resolver", {
            "extensions": [".ts", ".tsx"],
            "root": ["./src"],
        }],
        "@babel/plugin-transform-runtime",
        "@babel/proposal-class-properties",
        "@babel/proposal-object-rest-spread",
        "@babel/plugin-transform-react-jsx",
    ],
    "presets": [
        "module:@babel/preset-env",
        "module:@babel/preset-typescript",
    ],
};
