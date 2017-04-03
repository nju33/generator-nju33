import gulp from 'gulp';
import plumber from 'gulp-plumber';
import babel from 'gulp-babel';

gulp.task('lib', () => {
  gulp.src('lib/**/*.js')
    .pipe(plumber())
    .pipe(babel())
    .pipe(gulp.dest('generators'));
});

gulp.task('watch', ['lib'], () => {
  gulp.watch('lib/**/*.js', ['lib']);
});
