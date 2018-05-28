/* eslint-disable */

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const eslint = require('gulp-eslint');

var browserSync = require('browser-sync').create();

browserSync.stream();

gulp.task('styles', stylesTask);

gulp.task('lint', lintTask);

gulp.task('default', gulp.series('styles', 'lint'), defaultTask);

function defaultTask(done) {
    gulp.watch('scss/**/*.scss', gulp.series('styles'));
    gulp.watch('js/**/*.js', gulp.series('lint'));

    browserSync.init({
        server: './'
    });

    done();
}

function stylesTask(done) {
    gulp.src('scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./css'));

    done();
}

function lintTask(done) {
    gulp.src(['**/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());

    done();
}
