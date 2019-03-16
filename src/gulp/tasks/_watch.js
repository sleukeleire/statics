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
base.gulp.task('watch', watchTask);
