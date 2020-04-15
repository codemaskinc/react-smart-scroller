const path = require('path');

module.exports = {
    entry: './src',
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
        alias: {
            lib: path.resolve(__dirname, 'src/lib')
        }
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'react-smart-scroller',
        libraryTarget: 'umd'
    },
    optimization: {
        runtimeChunk: true
    }
};
