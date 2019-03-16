// ---
// IMAGES
// ---

// config
const config = require('../config').images;

// base
const base = require('../base').init();


// SVGS
function _imagesSvgs (changed) {
    return base.gulp
        .src(config.src_svgs)
        .pipe(base.$.if(changed, base.$.changed(config.dest)))
        .pipe(base.debug.log_files('images-svgs'))
        .pipe(base.$.svgmin())
        .pipe(base.gulp.dest(config.dest));
}
let imagesSvgs = function () { return _imagesSvgs(false) };
imagesSvgs.description = 'Copies and minifies SVG images';
const imagesSvgsTask = base.gulp.series(imagesSvgs);
base.gulp.task('images-svgs', imagesSvgsTask);
let imagesSvgsChanged = function () { return _imagesSvgs(true) };
imagesSvgsChanged.description = 'Copies and minifies all changed SVG images';
const imagesSvgsChangedTask = base.gulp.series(imagesSvgsChanged);
base.gulp.task('images-svgs-changed', imagesSvgsChangedTask);

// OTHER IMAGES
function _imagesOptimize (changed) {
    return base.gulp
        .src(config.src)
        .pipe(base.$.if(changed, base.$.changed(config.dest)))
        .pipe(base.debug.log_files('images-optimize'))
        .pipe(base.$.image())
        .pipe(base.gulp.dest(config.dest));
}
let imagesOptimize = function () { return _imagesOptimize(false); };
imagesOptimize.description = 'Copies and optimize non-svg-images';
const imagesOptimizeTask = base.gulp.series(imagesOptimize);
base.gulp.task('images-optimize', imagesOptimizeTask);
let imagesOptimizeChanged = function () { return _imagesOptimize(true); };
imagesOptimizeChanged.description = 'Copies and optimize all changed non-svg-images';
const imagesOptimizeChangedTask = base.gulp.series(imagesOptimizeChanged);
base.gulp.task('images-optimize-changed', imagesOptimizeChangedTask);

// BUILD
let imagesBuildTask = base.gulp.series(['images-svgs', 'images-optimize']);
imagesBuildTask.description = 'Copies and optimize images / svgs.';
base.gulp.task('images-build', imagesBuildTask);

// CLEANER
let imagesClean = function () {
    return base.gulp
        .src(config.clean)
        .pipe(base.debug.log_files('remove'))
        .pipe(base.files.remove());
};
imagesClean.description = 'cleans all optimized/minifies images';
const imagesCleanTask = base.gulp.series(imagesClean);
base.gulp.task('images-clean', imagesCleanTask);

// WATCHER
let imagesWatchSvgs = function () {
  // watch all svg files
  base.gulp.watch(config.watch.svg, imagesSvgsChanged);
};
imagesWatchSvgs.description = 'Start a watch task for all svg images.';
// first do images-svgs task once, then start watching images:
const imagesWatchSvgsTask = base.gulp.series([imagesSvgs, imagesWatchSvgs]);
base.gulp.task('images-watch-svgs', imagesWatchSvgsTask);

// WATCHER
let imagesWatchOther = function () {
  // watch all other files
  base.gulp.watch(config.watch.other, imagesOptimizeChanged);
};
imagesWatchOther.description = 'Start a watch task for all non-svg images.';
// first do images-optimize once, then start watching:
const imagesWatchOtherTask = base.gulp.series([imagesOptimize, imagesWatchOther]);
base.gulp.task('images-watch-other', imagesWatchOtherTask);

// WATCHER
let imagesWatchTask = base.gulp.parallel(['images-watch-svgs', 'images-watch-other']);
imagesWatchTask.description = 'Start a watch task for all images (svg & non-svg).';
base.gulp.task('images-watch', imagesWatchTask);
