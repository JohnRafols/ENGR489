var gulp = require('gulp');
var sass = require('gulp-sass');
var wiredep = require('wiredep').stream;
 

gulp.task('styles', function(){
   gulp.src('sass/**/*.scss')
    .pipe(wiredep())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('css'))
});


//Watch task
gulp.task('default', function() {
    gulp.watch('sass/**/*.scss',['styles']);
});