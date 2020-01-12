const minify = require('@node-minify/core');
const uglifyJS = require('@node-minify/uglify-js');
const cssnano = require('@node-minify/cssnano');


minify({
  compressor: uglifyJS,
  input: '../cdn/js/sr.js',
  output: '../cdn/js/sr.min.js',
  callback: function(err, min) {
  	console.log('done')
  }
});


minify({
  compressor: cssnano,
  input: '../cdn/theme/cart.css',
  output: '../cdn/theme/cart.min.css',
  type: 'css',
  callback: function(err, min) {
    console.log('YUI CSS one file');
    console.log(err);
    //console.log(min);
  }
});