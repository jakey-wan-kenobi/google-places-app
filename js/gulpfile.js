// gulp packages
var gulp  = require('gulp'),
    gutil = require('gulp-util');

// default task 
gulp.task('default', function() {
  return gutil.log('Hello world')
});