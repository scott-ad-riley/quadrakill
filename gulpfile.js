var gulp = require('gulp')
var nodemon = require('gulp-nodemon')
var browserSync = require('browser-sync').create();
var webpack = require('webpack-stream');

gulp.task('server', function() {
    nodemon({
        script: 'server/index.js',
        watch: ["server/*/**/*.js"],
        ext: 'js'
    }).on('restart', function() {
      gulp.src('server/index.js')
  })
})

gulp.task('client-serve', ['webpack'], function () {
    browserSync.init({
        server: ['./client/public/assets', './client/public/build'],
        ghostMode: false,
        open: false,
        reloadOnRestart: true
    });
    gulp.watch("client/public/src/**/*.js", ['reload']);
    gulp.watch("client/public/src/**/*.jsx", ['reload']);
    gulp.watch("client/engine/*.js", ['reload']);
});

gulp.task('webpack', function () {
  return gulp.src('./client/public/src/index.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('./client/public/build/'));
});

gulp.task('reload', ['webpack'], browserSync.reload);

gulp.task('default', ['client-serve', 'server'])
