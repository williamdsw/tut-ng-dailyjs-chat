var gulp = require('gulp');
var gulpTypescript = require('gulp-typescript');
var tsConfig = gulpTypescript.createProject('tsconfig.json');

gulp.task('build', function() {
    return tsConfig.src().pipe(tsConfig()).js.pipe(gulp.dest('./dist'));
});