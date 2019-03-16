// ---
// CLEAN
// ---

const config = require('../config');
const base = require('../base').init();
const dir = require('node-dir');

// cleaning everything:
let cleanTask = base.gulp.series([
  'js-clean',
  'scss-clean',
  'html-clean',
  'images-clean',
  'fonts-clean'
]);
cleanTask.description = 'Removes all generated files';
cleanTask.subTasks = 'SERIES([js-clean, scss-clean, html-clean, images-clean, fonts-clean])';
base.gulp.task('clean', cleanTask);
module.exports.clean = cleanTask;
