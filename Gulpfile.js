// Initialize modules needed
const { src, dest, watch, series, parallel } = require('gulp');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');

//File path variables
  //Super helpful, so you don't have to keep writing them over and over. Also, protects from error.

const files = {
    scssPath: 'library/sass/**/*.scss',
    jsPath: 'library/js/**/*.js',
    imgPath: 'library/img/*'
}

//Sass task

function scssTask(){
  return src(files.scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([ autoprefixer(), cssnano() ]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/css')
  );
}

//JS task

function jsTask() {
  return src(files.jsPath)
    .pipe(concat('production.js'))
    .pipe(uglify())
    .pipe(dest('dist/js')
  );
}


//Minify Images

function imgSmush() {
  return src(files.imgPath)
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
            {removeViewBox: true},
            {cleanupIDs: false}
          ]
        })
      ]))
    .pipe(dest('dist/img'));
}

// Cachebusting task (This allows your CSS and JS files to upgrade their versions each time to avoid browser loading cached versions)

  //Generates a string based on current time
const cbString = new Date().getTime();

  //Runs a search + Replace for query string at end of .css and .js files
function cacheBustTask(){
  return src(['index.php'])
    .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
    .pipe(dest('.'))
}

//Watch
function watchTask(){
    watch([files.scssPath, files.jsPath],
        {interval: 1000, usePolling: true}, //Makes docker work
        series(
            parallel(scssTask, jsTask),
            cacheBustTask
        )
    );
}


// Default task when you start gulp in terminal:

exports.default = series(
    parallel(scssTask, jsTask, imgSmush),
    cacheBustTask,
    watchTask
);
