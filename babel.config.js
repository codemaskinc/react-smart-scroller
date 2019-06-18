module.exports = {
    "presets": [
        "module:@babel/preset-react",
        "module:@babel/preset-typescript"
    ],
    "plugins": [
        ["module-resolver", {
            "root": ["./src"],
            "extensions": [".ts", ".tsx"]
        }],
        "@babel/plugin-transform-runtime",
        "@babel/proposal-class-properties",
        "@babel/proposal-object-rest-spread"
    ],
    "env": {
        "production": {
            "plugins": ["transform-remove-console"]
        },
    }
}
