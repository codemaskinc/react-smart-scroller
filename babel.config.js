module.exports = {
  // ...
  plugins: [
    // ... other plugins
    [
      'babel-plugin-module-resolver',
      {
        root: ['./src/'],
        alias: require('./tsconfig.json').compilerOptions.paths,
      },
    ],
  ],
}