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
const gzip = require('gulp-gzip');

// var browserSync = require('browser-sync').create();

gulp.task('styles', stylesTask);

gulp.task('copy-html', copyHTMLTask);

gulp.task('copy-manifest', copyManifestTask);

gulp.task('copy-images', copyImagesTask);

gulp.task('move-scripts', moveScriptsTask);

gulp.task('scripts', scriptsTask);

gulp.task('scripts-dist', scriptsDistTask);

gulp.task('clean-sw', cleanSWScriptTask);

gulp.task('clean-node-modules', cleanNodeModulesScriptsTask);

gulp.task('lint', lintTask);

// gulp.task('browser-sync', browserSyncTask);

gulp.task('watch', watchTask);

gulp.task('default', gulp.series(
    'copy-html',
    'copy-images',
    'styles',
    'lint',
    'move-scripts',
    'scripts',
    'clean-sw',
    'clean-node-modules',
    // 'browser-sync',
    'watch'
));

gulp.task('dist', gulp.series(
    'copy-html',
    'copy-manifest',
    'copy-images',
    'styles',
    'move-scripts',
    'scripts-dist',
    // 'clean-sw',
    // 'clean-node-modules',
    // 'lint'
));

function stylesTask(done) {
    gulp.src('scss/**/index.scss')
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
        .pipe(gulp.dest('./dist'))

    done();
}

function copyManifestTask(done) {
    gulp.src('./manifest.json')
        .pipe(gulp.dest('./dist'))

    done();
}

function copyImagesTask(done) {
    gulp.src('./img/*.webp')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/img'))

    done();
}

function moveScriptsTask(done) {
    const idb = gulp.src('./node_modules/idb/lib/idb.js')
        .pipe(gulp.dest('./js'))

    const echo = gulp.src('./node_modules/echo-js/dist/echo.min.js')
        .pipe(gulp.dest('./js'))

    const sw = gulp.src('./sw.js')
        .pipe(gulp.dest('./js'))

    return merge(idb, sw, echo);
}

function scriptsTask(done) {
    gulp.src('js/**/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./dist/js'))

    done();
}

function scriptsDistTask(done) {
    gulp.src('js/**/*.js')
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gzip())
        .pipe(gulp.dest('./dist/js'))

    done();
}

function cleanSWScriptTask(done) {
    gulp.src('./js/sw.js', { read: false })
        .pipe(rm())

    done()
}

function cleanNodeModulesScriptsTask(done) {
    const idb = gulp.src('./js/idb.js', { read: false })
        .pipe(rm())

    const echo = gulp.src('./js/echo.min.js', { read: false })
        .pipe(rm())

    return merge(idb, echo);
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
