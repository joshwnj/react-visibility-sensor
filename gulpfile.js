var gulp = require('gulp');
var jsx = require('gulp-jsx');
var rename = require("gulp-rename")

gulp.task('build', function() {
  return gulp.src('visibility-sensor.jsx')
    .pipe(jsx())
    .pipe( rename(function (path) {
      path.extname = ".js"
    }))
    .pipe(gulp.dest('dist'));
});
