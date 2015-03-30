var gulp = require('gulp');
var jsx = require('gulp-jsx');

gulp.task('build', function() {
  return gulp.src('visibility-sensor.jsx')
    .pipe(jsx())
    .pipe(gulp.dest('dist'));
});
