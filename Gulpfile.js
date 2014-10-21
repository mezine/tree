var gulp = require('gulp');
var bundle = require('thebundle');
var sass = require('gulp-sass');


var libs = ['backbone', 'react', 'react-router'];

gulp.task('default', function() {
  var startBundle = bundle('./js/start.js', './public/build/start.js');
  // var libsBundle = bundle(libs, './public/build/libs.js');
  // var startBundle = bundle('./components/start.js', './public/build/start.js', libsBundle);
});

gulp.task('sass', function () {
  gulp.watch('./scss/*.scss', ['compile-sass']);
});

gulp.task('compile-sass', function () {
  gulp.src('./scss/stylesheet.scss')
    .pipe(sass({errLogToConsole: true}))
    .pipe(gulp.dest('./public/css'));
});