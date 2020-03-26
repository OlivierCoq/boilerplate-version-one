const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');

// function defaultTask(cb) {
//   // place code for your default task here
//   cb();
// }
//
// exports.default = defaultTask

//Compile Sass

gulp.task('sass', function() {

  return gulp.src(['library/sass/*.scss'])
    .pipe(sass())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});


//Watch & Serve
gulp.task('serve', ['sass'], function(){
  browserSync.init({
    server: './src'
  });

gulp.watch(['library/sass/*.scss'], ['sass']);
gulp.watch(['src/*.php']).on('change', browserSync.reload);

});


//Default task

gulp.task('default', ['serve']);
