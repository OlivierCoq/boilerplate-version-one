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

//File path variables

const files = {
    scssPath: 'library/sass/**/*.scss',
    jsPath: 'library/js/**/*.js'
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


// Default task

exports.default = series(
    parallel(scssTask, jsTask),
    cacheBustTask,
    watchTask
);
