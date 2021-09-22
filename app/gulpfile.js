const gulp = require('gulp');
const sass = require('gulp-sass')(require('node-sass'));
const cssnano = require('gulp-cssnano');
const browserSync = require('browser-sync').create();
const del = require('del');
const pug = require('gulp-pug');
const svgSprite = require('gulp-svg-sprite');
const concat = require('gulp-concat');

const clear = (cb) => {
  return del([
    './build'
  ])
}

const scss = (cb) => {
  return gulp.src('./scss/app.scss')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('./../build/css'))
    .pipe(browserSync.stream())
}

const pugjs = (cb) => {
  return gulp.src('./pug/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('./../build'))
}

const fonts = (cb) => {
  return gulp.src('./fonts/*.ttf')
    .pipe(gulp.dest('./../build/fonts'))
}

const images = (cb) => {
  return gulp.src('./images/*.{png,svg,jpg,jpeg}')
    .pipe(gulp.dest('./../build/images'))
}

const sprite = (cb) => {
  const config = {
    mode: {
      stack: { // Activate the «css» mode
        sprite: "./sprite.svg"
      }
    }
  };

  return gulp.src('./sprite/*.svg')
  .pipe(svgSprite(config))
  .pipe(gulp.dest('./../build/images'));
}

const js = (cb) =>{
  return gulp.src([
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/popper.js/dist/umd/popper.min.js',
    './node_modules/bootstrap/dist/js/bootstrap.min.js'
  ])
  .pipe(concat('script.js'))
  .pipe(gulp.dest('./../build/js'))
}

const local = (cb) => {
  browserSync.init({
    open: false,
    server: {
      baseDir: "./../build"
    }
  });

  gulp.watch('./scss/**/*.scss', scss);
  gulp.watch('./pug/**/*.pug', pugjs);
  gulp.watch('./../build/*.html').on('change', browserSync.reload);
}


exports.local = gulp.series(
  clear,
  scss,
  pugjs,
  images,
  fonts,
  sprite,
  js,
  local
)
