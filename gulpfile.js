var gulp = require('gulp');

//CSS
var sass = require('gulp-sass');
var minifycss = require('gulp-uglifycss');
var autoprefixer = require('gulp-autoprefixer');
var mmq = require('gulp-merge-media-queries');

//JS
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

// Utilidades
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var lineec = require('gulp-line-ending-corrector');
var filter = require('gulp-filter');
var notify = require('gulp-notify');

const AUTOPREFIXER_BROWSERS = [
    'last 2 version',
    '> 1%',
    'ie >= 9',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4',
    'bb >= 10'
];

var jsFiles = "./dev/js/*.js";

var styleFiles = "./dev/scss/style.scss";
var styleWatchFiles = './dev/scss/**/*.scss';
var styleDestination = './';

var bootstrapFiles = "./node_modules/bootstrap/dist/";
var buildJS = './build/js/'

var projectURL = 'localhost/tig';

gulp.task('browser-sync', function () {
    browserSync.init({
        proxy: projectURL,
        open: true,
        injectChanges: true,
    });
});

gulp.task('js', function () {
    gulp.src(jsFiles)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify())
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./build/js/'))
});

gulp.task('styles', function(){
    gulp.src(styleFiles)
    .pipe( sourcemaps.init())
    .pipe( sass({
        errLogToConsole: true,
        outputStyle: 'compact',
        precision: 10
    }))
    .on('error', console.error.bind(console))
    .pipe(sourcemaps.write({includeContent: false}))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(autoprefixer( AUTOPREFIXER_BROWSERS))
    .pipe(sourcemaps.write( styleDestination))
    .pipe( lineec())
    .pipe(gulp.dest(styleDestination))
    .pipe( filter('**/.*css'))
    .pipe( mmq( {log: true}))
    .pipe(browserSync.stream())
    .pipe( rename( {suffix: '.min'}))
    .pipe( minifycss({
        maxLineLen: 10
    }))
    .pipe(gulp.dest(styleDestination))
    .pipe( filter('**/.*css'))
    .pipe(browserSync.stream())
    .pipe( notify( { message: 'TASK: "styles" Completed! 💯', onLast: true } ) )
});

gulp.task('copy', function () {
    gulp.src(bootstrapFiles + 'js/bootstrap.min.js')
        .pipe(gulp.dest('./build/js/'));
    gulp.src(bootstrapFiles + 'css/bootstrap.min.css')
        .pipe(gulp.dest('./build/css/'));
});

gulp.task('default', function () {
    
});

