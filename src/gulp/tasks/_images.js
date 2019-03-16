// ---
// IMAGES
// ---

// config
const config = require('../config').images;

// base
const base = require('../base').init();


// SVGS
const _imagesSvgs = function (changed) {
    return base.gulp
        .src(config.src_svgs)
        .pipe(base.$.if(changed, base.$.changed(config.dest)))
        .pipe(base.debug.log_files('images-svgs'))
        .pipe(base.$.svgmin())
        .pipe(base.gulp.dest(config.dest));
}
const imagesSvgs = function () { return _imagesSvgs(false) };
let imagesSvgsTask = base.gulp.series(imagesSvgs);
imagesSvgsTask.description = 'Copies and minifies SVG images';
base.gulp.task('images-svgs', imagesSvgsTask);
module.exports['images-svgs'] = imagesSvgsTask;

const imagesSvgsChanged = function () { return _imagesSvgs(true) };
let imagesSvgsChangedTask = base.gulp.series(imagesSvgsChanged);
imagesSvgsChangedTask.description = 'Copies and minifies all changed SVG images';
base.gulp.task('images-svgs-changed', imagesSvgsChangedTask);
module.exports['images-svgs-changed'] = imagesSvgsChangedTask;

// OTHER IMAGES
const _imagesOptimize = function (changed) {
    return base.gulp
        .src(config.src)
        .pipe(base.$.if(changed, base.$.changed(config.dest)))
        .pipe(base.debug.log_files('images-optimize'))
        .pipe(base.$.image())
        .pipe(base.gulp.dest(config.dest));
}
const imagesOptimize = function () { return _imagesOptimize(false); };
let imagesOptimizeTask = base.gulp.series(imagesOptimize);
imagesOptimizeTask.description = 'Copies and optimize non-svg-images';
base.gulp.task('images-optimize', imagesOptimizeTask);
module.exports['images-optimize'] = imagesOptimizeTask;

const imagesOptimizeChanged = function () { return _imagesOptimize(true); };
let imagesOptimizeChangedTask = base.gulp.series(imagesOptimizeChanged);
imagesOptimizeChangedTask.description = 'Copies and optimize all changed non-svg-images';
base.gulp.task('images-optimize-changed', imagesOptimizeChangedTask);
module.exports['images-optimize-changed'] = imagesOptimizeChangedTask;

// BUILD
let imagesBuildTask = base.gulp.series(['images-svgs', 'images-optimize']);
imagesBuildTask.description = 'Copies and optimize images / svgs.';
imagesBuildTask.subTasks = 'SERIES([images-svgs, images-optimize])';
base.gulp.task('images-build', imagesBuildTask);
module.exports['images-build'] = imagesBuildTask;

// CLEANER
const imagesClean = function () {
  return base.gulp
  .src(config.clean)
  .pipe(base.debug.log_files('remove'))
  .pipe(base.files.remove());
};
let imagesCleanTask = base.gulp.series(imagesClean);
imagesCleanTask.description = 'cleans all optimized/minifies images';
base.gulp.task('images-clean', imagesCleanTask);
module.exports['images-clean'] = imagesCleanTask;

// WATCHER
const imagesWatchSvgs = function () {
  // watch all svg files
  base.gulp.watch(config.watch.svg, imagesSvgsChanged);
};
// first do images-svgs task once, then start watching images:
let imagesWatchSvgsTask = base.gulp.series([imagesSvgs, imagesWatchSvgs]);
imagesWatchSvgsTask.description = 'Start a watch task for all svg images.';
imagesWatchSvgsTask.subTasks = 'SERIES([images-svgs, images-watch-svgs])';
base.gulp.task('images-watch-svgs', imagesWatchSvgsTask);
module.exports['images-watch-svgs'] = imagesWatchSvgsTask;

// WATCHER
const imagesWatchOther = function () {
  // watch all other files
  base.gulp.watch(config.watch.other, imagesOptimizeChanged);
};
// first do images-optimize once, then start watching:
let imagesWatchOtherTask = base.gulp.series([imagesOptimize, imagesWatchOther]);
imagesWatchOtherTask.description = 'Start a watch task for all non-svg images.';
imagesWatchOtherTask.subTasks = 'SERIES([images-optimize, images-watch-other])';
base.gulp.task('images-watch-other', imagesWatchOtherTask);
module.exports['images-watch-other'] = imagesWatchOtherTask;

// WATCHER
let imagesWatchTask = base.gulp.parallel(['images-watch-svgs', 'images-watch-other']);
imagesWatchTask.description = 'Start a watch task for all images (svg & non-svg).';
imagesWatchTask.subTasks = 'SERIES([images-watch-svgs, images-watch-other])';
base.gulp.task('images-watch', imagesWatchTask);
module.exports['images-watch'] = imagesWatchTask;
