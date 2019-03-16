// ---
// FONTS
// ---

// config
const config = require('../config').fonts;

// base
const base = require('../base').init();

// @TODO, convert fonts to woff and woff2!

// TASK
const _fonts = function (changed) {
    return base.gulp
        .src(config.src)
        .pipe(base.$.if(changed, base.$.changed(config.dest)))
        .pipe(base.debug.log_files('fonts'))
        .pipe(base.gulp.dest(config.dest));
}
const fonts = function () { return _fonts(false); };
let fontsTask = base.gulp.series(fonts);
fontsTask.description = 'Copies all .woff and .woff2 fonts';
base.gulp.task('fonts', fontsTask);
module.exports.fonts = fontsTask;

const fontsChanged = function () { return _fonts(true); };
let fontsChangedTask = base.gulp.series(fontsChanged);
fontsChangedTask.description = 'Copies all changed .woff and .woff2 fonts';
base.gulp.task('fonts-changed', fontsChangedTask);
module.exports['fonts-changed'] = fontsChangedTask;

// CLEANER
const fontsClean = function () {
  return base.gulp
      .src(config.clean)
      .pipe(base.debug.log_files('remove'))
      .pipe(base.files.remove());
};
let fontsCleanTask = base.gulp.series(fontsClean);
fontsCleanTask.description = 'cleans all fonts';
base.gulp.task('fonts-clean', fontsCleanTask);
module.exports['fonts-clean'] = fontsCleanTask;

// BUILD
let fontsBuildTask = base.gulp.series(['fonts-clean', 'fonts']);
fontsBuildTask.description = 'Copies all .woff and .woff2 fonts';
fontsBuildTask.subTasks = 'SERIES([fonts-clean, fonts])';
base.gulp.task('fonts-build', fontsBuildTask);
module.exports['fonts-build'] = fontsBuildTask;

// WATCHER
const fontsWatch = function () {
  // watch all woff and woff2 files in fonts folder
  base.gulp.watch(config.watch, fontsChanged);
};
// first do fonts once, then start watching:
let fontsWatchTask = base.gulp.series([fonts, fontsWatch]);
base.gulp.task('fonts-watch', fontsWatchTask);
fontsWatchTask.description = 'Start a watch task for all fonts.';
fontsWatchTask.subTasks = 'SERIES([fonts, fontsWatch])';
module.exports['fonts-watch'] = fontsWatchTask;
