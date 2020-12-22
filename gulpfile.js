const htmlFile = "index.html";
const sassFiles = "src/sass/**/*.scss";
const sassToCompile = "src/sass/style.scss";
const folderDist = "dist/css";
const cssToMin = "dist/css/style.css";

/////////////////////////// PLUGINS //////////////////

const { src, watch, dest, series } = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const cleanCss = require("gulp-clean-css");
const rename = require("gulp-rename");
const sourceMaps = require("gulp-sourcemaps");

//////////////// watch task /////////////

function watchForChanges() {
  browserSync.init({
    notify: false,
    server: {
      baseDir: "./",
    },
  });
  watch(htmlFile).on("change", browserSync.reload);
  watch(sassFiles, series(sassToCss, minifyCss, cssinject));
}

////////////// compile sass to regular css /////

function sassToCss() {
  return src(sassToCompile)
    .pipe(sourceMaps.init())
    .pipe(sass())
    .pipe(sourceMaps.write())
    .pipe(dest(folderDist));
}

////// mininify and rename css ////////

function minifyCss() {
  return src(cssToMin)
    .pipe(sourceMaps.init())
    .pipe(cleanCss({ compatibility: "ie8" }))
    .pipe(concat("style.css"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourceMaps.write())
    .pipe(dest(folderDist));
}

/// inject style directly on browser when you save a change //

function cssinject() {
  return src(folderDist + "/style.min.css").pipe(browserSync.stream());
}

exports.watchForChanges = watchForChanges;
exports.sassToCompile = sassToCompile;
exports.minifyCss = minifyCss;
exports.cssinject = cssinject;
exports.default = watchForChanges;
