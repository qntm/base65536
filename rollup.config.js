module.exports = [{
  // nearly indistinguishable from a copy and paste of the source
  input: 'src/index.js',
  output: {
    file: 'dist/es6/base65536.js',
    format: 'esm'
  }
}, {
  // same as above but Node.js-friendly
  input: 'src/index.js',
  output: {
    file: 'dist/cjs/base65536.js',
    format: 'cjs'
  }
}, {
  // this can be imported into the browser as a script
  input: 'src/index.js',
  output: {
    file: 'dist/iife/base65536.js',
    format: 'iife',
    name: 'base65536'
  }
}]
