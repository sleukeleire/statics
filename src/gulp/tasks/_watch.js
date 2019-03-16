// ---
// WATCH
// ---

// config
// const config = require('../config').watch;

// Initialize base variables
const base = require('../base').init();

// tasks
let watchTask = base.gulp.series('clean', base.gulp.parallel(['scss-watch', 'js-watch', 'html-watch', 'images-watch', 'fonts-watch']));
watchTask.description = 'Start a watch task to compile all assets';
watchTask.subTasks = 'SERIES([clean, PARALLEL([scss-watch, js-watch, html-watch, images-watch, fonts-watch])])';
base.gulp.task('watch', watchTask);
module.exports['watch'] = watchTask;
