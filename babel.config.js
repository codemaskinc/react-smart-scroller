module.exports = {
  // ...
  plugins: [
    // ... other plugins
    [
      'babel-plugin-module-resolver',
      {
        root: './',
        alias: {
          "lib/utils": "./src/lib/utils",
          "lib/styles": "./src/lib/styles",
          "lib/types": "./src/lib/types",
          "lib/common": "./src/lib/common"
        },
      },
    ],
  ],
}
