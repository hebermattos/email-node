const { src, dest, series, parallel } = require('gulp');;
const minifyCSS = require('gulp-csso');
const uglify = require('gulp-uglify');
const purgecss = require('gulp-purgecss')
const concatCss = require('gulp-concat-css')
const clean = require('gulp-clean');
const gulpCopy = require('gulp-copy');
const install = require("gulp-install");
const imagemin = require('gulp-imagemin');
const htmlreplace = require('gulp-html-replace');
const htmlmin = require('gulp-htmlmin');
const concat = require('gulp-concat');

function createFolders() {
    return src('*.*', { read: false })
        .pipe(dest('./build'))
};

function cleanBuild() {
    return src('build', { read: false })
        .pipe(clean());
};

function copyServer() {
    return src(['app.js'])
        .pipe(gulpCopy('build', { prefix: 1 }))
};

function copyConfig() {
    return src(['config/**/*'])
        .pipe(gulpCopy('build/config', { prefix: 1 }))
};

function copyPackage() {
    return src(['package.json'])
        .pipe(gulpCopy('build/', { prefix: 1 }))
};

function copyAssets() {
    return src(['./public/assets/**/*'])
        .pipe(gulpCopy('./build/public/assets', { prefix: 1 }))
};

function css() {
    return src('./public/css/*.css')
        .pipe(purgecss({
            content: ["./views/**/*.handlebars"]
        }))
        .pipe(concatCss('app.min.css'))
        .pipe(minifyCSS())
        .pipe(dest('./build/public/css'))
};

function js() {
    return src('./public/js/*.js', { sourcemaps: true })
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(dest('./build/public/js', { sourcemaps: false }))
};

function installPackages() {
    return src('./build/package.json', { sourcemaps: true })
        .pipe(install({npm: '--production',}))
};

function images() {
    return src('./public/assets/**/*')
        .pipe(imagemin({
            verbose: true
        }))
        .pipe(dest('./build/public/assets'))
};

function html() {
    return src('./views/**/*.handlebars')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(htmlreplace({
            'css': 'css/app.min.css',
            'js': 'js/app.min.js'
        }))
        .pipe(dest('./build/views'));
}

function removePackageJson() {
    return src('build/*.json', { read: false })
        .pipe(clean());
};

exports.css = css;
exports.js = js;
exports.images = images;
exports.html = html;

exports.default = series(
        createFolders, cleanBuild, 
        parallel(copyServer, copyConfig, copyPackage, copyAssets), 
        parallel(images, installPackages, css, js, html),
        removePackageJson
    );