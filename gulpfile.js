/* eslint-disable */

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const eslint = require('gulp-eslint');
const watch = require('gulp-watch');

var browserSync = require('browser-sync').create();

gulp.task('styles', stylesTask);

gulp.task('lint', lintTask);

gulp.task('browser-sync', browserSyncTask);

gulp.task('watch', watchTask);

gulp.task('default', gulp.series('styles', 'lint', 'browser-sync', 'watch'));

function watchTask(done) {
    gulp.watch('js/**/*.js', gulp.series('lint'));
    gulp.watch('scss/**/*.scss', gulp.series('styles'));
}

function stylesTask(done) {
    gulp.src('scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());

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
    console.log('1123321132')
    browserSync.init(null, {
        open: false,
        server: {
            baseDir: "./",
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
