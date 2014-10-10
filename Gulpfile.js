var gulp = require('gulp');
var bundle = require('thebundle');

var libs = ['backbone', 'react', 'react-router'];

gulp.task('default', function() {
  var startBundle = bundle('./js/start.js', './public/build/start.js');
  // var libsBundle = bundle(libs, './public/build/libs.js');
  // var startBundle = bundle('./components/start.js', './public/build/start.js', libsBundle);
});