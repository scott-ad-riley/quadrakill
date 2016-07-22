var gulp = require('gulp')
var nodemon = require('gulp-nodemon')
var browserSync = require('browser-sync').create();
var webpack = require('webpack-stream');

gulp.task('server', function() {
    nodemon({
        script: 'server/index.js',
        watch: ["server/*/**"],
        ext: 'js'
    }).on('restart', function() {
      gulp.src('server/index.js')
      console.log('message on restart foo')
  })
})


gulp.task('client-serve', ['webpack'], function () {
    browserSync.init({
        server: ['./client/public/assets', './client/public/build']
    });
    gulp.watch("client/public/src/*.js", ['reload']);
});

// process JS files and return the stream.
gulp.task('webpack', function () {
  return gulp.src('./client/public/src/index.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('./client/public/build/'));
});

gulp.task('reload', ['webpack'], browserSync.reload);

gulp.task('default', ['client-serve', 'server'])
