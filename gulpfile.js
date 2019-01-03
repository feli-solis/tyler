const gulp = require('gulp');
const browserSync = require("browser-sync");
//const gutil = require("gulp-util");
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');

const postcss = require('gulp-postcss');
const autoprefixer = require("autoprefixer");
//const cssnano = require("cssnano");

const sassPaths = [
    'node_modules/bootstrap/scss',
];

const jsPaths = [
    'node_modules/jquery/dist/jquery.js',
    'node_modules/popper.js/dist/popper.js',
    'node_modules/bootstrap/dist/js/bootstrap.js',
    // Custom Scripts
    './src/js/**/*.js'
];

const browsers = ['last 2 versions', 'ie >= 9', 'ios >= 7'];

// function copyAssets() {
//     return gulp.src('./node_modules/font-awesome/scss/*')
//         .pipe(gulp.dest('./assets/scss/vendor/font-awesome/'))
//         gulp.src('./node_modules/font-awesome/fonts/*')
//         .pipe(gulp.dest('./_site/assets/fonts/'))
// }

function processJs() {
    return gulp.src(jsPaths)
        .pipe(concat(('app.js')))
        //.pipe(uglify())
        .pipe(gulp.dest('./dist/js/'))
        // Compile files into both _site/assets (for local testing) and assets (for future jekyll builds)
        //.pipe(gulp.dest('./assets/js/'))
        .pipe(browserSync.stream());
}

function processCss() {
    return gulp.src('./src/scss/app.scss')
    .pipe(sass({
        includePaths: sassPaths,
        outputStyle: 'expanded'
    })).on('error', sass.logError)
    // .pipe(postcss([
    //     autoprefixer({browsers: browsers}),
    //     cssnano()]))
    .pipe(postcss([autoprefixer({browsers: browsers})]))
    .pipe(gulp.dest('./dist/css/'))
    // Compile files into both _site/assets (for local testing) and assets (for future jekyll builds)
    //.pipe(gulp.dest('./assets/css/'))
    .pipe(browserSync.stream());
}

// function build() {
//     return gulp.src('index.html', {read: false})
//     .pipe(shell([
//         'bundle exec jekyll build --drafts --config _config.yml,_config.localhost.yml'
//     ])).on('error', gutil.log);
// }

function serve() {
    return browserSync.init({
        port: 4000,
        server: {
            baseDir: "./"
        }
    });
}

// BrowserSync Reload
function browserSyncReload(done) {
    browserSync.reload();
    done();
}

// Watch
function watch() {
    gulp.watch('./src/scss/**/*.scss', processCss);
    gulp.watch("./src/js/**/*.js", processJs);
    //gulp.watch(['**/*.+(html|md|markdown|MD)', '!_site/**/*.*'], gulp.series(build, browserSyncReload));
    gulp.watch('index.html', gulp.series(browserSyncReload));
}

// gulp.task('copyAssets', gulp.series(copyAssets));

// Build
//gulp.task('build', gulp.series(build, browserSyncReload));

// Build and serve
//gulp.task('buildAndServe', gulp.series(processJs, processCss, build, gulp.parallel(serve, watch)));
gulp.task('buildAndServe', gulp.series(processJs, processCss, gulp.parallel(serve, watch)));

// function deploy() {
//     return gulp.src("./_site/**/*")
//     .pipe(ghPages({
//         remoteUrl: 'https://github.com/feli-solis/feli-solis.github.io.git',
//         branch: 'master' 
//     }));
// }

// Deploy
//gulp.task('deploy', gulp.series(deploy));

/* function defaultTask(cb) {
    // place code for your default task here
    cb();
  }
  
  exports.default = defaultTask */