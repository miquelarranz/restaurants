/* eslint-disable */

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const eslint = require('gulp-eslint');
const watch = require('gulp-watch');

var browserSync = require('browser-sync').create();

gulp.task('styles', stylesTask);

gulp.task('copy-html', copyHTMLTask);

gulp.task('copy-images', copyImagesTask);

gulp.task('lint', lintTask);

gulp.task('browser-sync', browserSyncTask);

gulp.task('watch', watchTask);

gulp.task('default', gulp.series('copy-html', 'copy-images', 'styles', 'lint', 'browser-sync', 'watch'));

function stylesTask(done) {
    gulp.src('scss/**/index.scss')
        .pipe(sass(
            {outputStyle: 'compressed'}
        ).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());

    done();
}

function copyHTMLTask(done) {
    gulp.src('./*.html')
    .pipe(gulp.dest('./dist'))

    done();
}

function copyImagesTask(done) {
    gulp.src('./img/*.jpg')
    .pipe(gulp.dest('./dist/img'))

    done();
}

function lintTask(done) {
    gulp.src(['**/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.result(result => {
    	    console.log(`ESLint result: ${result.filePath}`);
    	    console.log(`# Messages: ${result.messages.length}`);
    	    console.log(`# Warnings: ${result.warningCount}`);
    	    console.log(`# Errors: ${result.errorCount}`);
    	}));

    done();
}

function browserSyncTask(done) {
    browserSync.init({
        open: false,
        server: {
            baseDir: "./dist",
            middleware: function(req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
                next();
            }
        },
        watchOptions: {
            debounceDelay: 1000
        }
    });

    done();
}

function watchTask(done) {
    gulp.watch('js/**/*.js', gulp.series('lint'));
    gulp.watch('scss/**/*.scss', gulp.series('styles'));
    gulp.watch('./*.html', gulp.series('copy-html'));
    gulp.watch('./dist/*.html').on('change', browserSync.reload);
}
