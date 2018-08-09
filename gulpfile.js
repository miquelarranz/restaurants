/* eslint-disable */

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const eslint = require('gulp-eslint');
const watch = require('gulp-watch');
const concat = require('gulp-concat');
const rm = require('gulp-rm');
const uglify = require('gulp-uglify-es').default;
const merge = require('merge-stream');
const uglifycss = require('gulp-uglifycss');
const imagemin = require('gulp-imagemin');
const inlineCss = require('gulp-inline-css');

// var browserSync = require('browser-sync').create();

gulp.task('styles', stylesTask);

gulp.task('styles-inline', stylesInlineTask);

gulp.task('copy-html', copyHTMLTask);

gulp.task('copy-manifest', copyManifestTask);

gulp.task('copy-images', copyImagesTask);

gulp.task('move-scripts', moveScriptsTask);

gulp.task('scripts', scriptsTask);

gulp.task('scripts-dist', scriptsDistTask);

gulp.task('scripts-detail-dist', scriptsDetailDistTask);

gulp.task('clean-scripts', cleanScriptsTask);

gulp.task('lint', lintTask);

// gulp.task('browser-sync', browserSyncTask);

gulp.task('watch', watchTask);

gulp.task('default', gulp.series(
    'copy-images',
    'styles',
    'copy-html',
    'lint',
    'move-scripts',
    'scripts',
    'clean-scripts',
    // 'browser-sync',
    'watch'
));

gulp.task('dist', gulp.series(
    'copy-manifest',
    'copy-images',
    'styles-inline',
    'copy-html',
    'styles',
    'move-scripts',
    'scripts-dist',
    'scripts-detail-dist',
    // 'clean-scripts',
    // 'lint'
));

function stylesTask(done) {
    gulp.src([
        'scss/**/index.scss',
        'scss/**/restaurant.scss'
    ])
        .pipe(sass(
            {outputStyle: 'compressed'}
        ).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(uglifycss({
            "maxLineLen ": 80,
            "uglyComments": true
        }))
        .pipe(gulp.dest('dist/css'))
        // .pipe(browserSync.stream());

    done();
}

function stylesInlineTask(done) {
    gulp.src([
        'scss/**/header.scss',
        'scss/**/styles.scss'
    ])
        .pipe(sass(
            {outputStyle: 'compressed'}
        ).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(uglifycss({
            "maxLineLen ": 80,
            "uglyComments": true
        }))
        .pipe(gulp.dest('dist/css'))
        // .pipe(browserSync.stream());

    done();
}

function copyHTMLTask(done) {
    gulp.src('./*.html')
        .pipe(inlineCss())
        .pipe(gulp.dest('./dist'))

    done();
}

function copyManifestTask(done) {
    gulp.src([
        './manifest.json',
        './sw.js',
    ])
        .pipe(gulp.dest('./dist'))

    done();
}

function copyImagesTask(done) {
    gulp.src([
        './img/*.webp',
        './img/*.png'
    ])
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/img'))

    done();
}

function moveScriptsTask(done) {
    gulp.src([
        './node_modules/idb/lib/idb.js',
        './node_modules/echo-js/dist/echo.min.js',
        './sw.js'
    ]).pipe(gulp.dest('./js'))

    done();
}

function scriptsTask(done) {
    gulp.src([
        'js/**/*.js',
        './node_modules/idb/lib/idb.js',
        './node_modules/echo-js/dist/echo.min.js',
        './sw.js'
    ]).pipe(concat('all.js'))
        .pipe(gulp.dest('./dist/js'))

    done();
}

function scriptsDistTask(done) {
    gulp.src([
        './js/dbhelper.js',
        './js/echo.min.js',
        './js/idb.js',
        './js/indexdb-helper.js',
        './js/main.js',
        './js/service-worker.js',
        // './js/sw.js',
    ])
        .pipe(concat('all.js'))
        .pipe(uglify())
        // .pipe(gzip())
        .pipe(gulp.dest('./dist/js'))

    done();
}

function scriptsDetailDistTask(done) {
    gulp.src([
        './js/dbhelper.js',
        './js/echo.min.js',
        './js/idb.js',
        './js/indexdb-helper.js',
        './js/restaurant_info.js',
        './js/service-worker.js',
        // './js/sw.js',
    ])
        .pipe(concat('all-detail.js'))
        .pipe(uglify())
        // .pipe(gzip())
        .pipe(gulp.dest('./dist/js'))

    done();
}

function cleanScriptsTask(done) {
    gulp.src([
        './js/sw.js',
        './js/idb.js',
        './js/echo.min.js'
    ], { read: false }).pipe(rm())

    done()
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
//
// function browserSyncTask(done) {
//     browserSync.init({
//         open: false,
//         server: {
//             baseDir: "./dist",
//             middleware: function(req, res, next) {
//                 res.setHeader('Access-Control-Allow-Origin', '*');
//                 res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//                 res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
//                 next();
//             }
//         },
//         watchOptions: {
//             debounceDelay: 1000
//         }
//     });
//
//     done();
// }

function watchTask(done) {
    gulp.watch('js/**/*.js', gulp.series('lint', 'move-scripts', 'scripts', 'clean'));
    gulp.watch('scss/**/*.scss', gulp.series('styles'));
    gulp.watch('./*.html', gulp.series('copy-html'));
    // gulp.watch('./dist/*.html').on('change', browserSync.reload);

    done();
}
