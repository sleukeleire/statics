// ---
// BUILD
// ---

// config
const config = require('../config').build;

// base
const base = require('../base').init();

// filestream
const fs = require('fs');

// task need to be defined when used in gulp.series(...), so we require all needed tasks, @TODO, untill we use the gulp 4.0 syntax to split our tasks files in modules
require('./_scss.js');
require('./_javascript.js');
require('./_html.js');
require('./_images.js');
require('./_fonts.js');

// tasks
let buildTask = base.gulp.series(['scss-build', 'js-build', 'html-build', 'images-build', 'fonts-build']);
buildTask.description = 'Builds js, css, html, images and fonts';
buildTask.subTasks = 'SERIES([scss-build, js-build, html-build, images-build, fonts-build])';
buildTask.options = {
  'production': 'Compiles compressed.'
};
base.gulp.task('build', buildTask);
module.exports.build = buildTask;

// increase css/js version nr to prevent locale caching after a new build:
// function increaseVersion (cb) {
//   fs.readFile(config.version_file, {encoding: 'utf8', flag: 'r'}, (err, data) => {
//       if (err) {
//         if (err.errno === -2) {
//           base.debug.log(config.version_file + ' does not exist, creating file now');
//           fs.writeFileSync(config.version_file, 0);
//           increaseVersion(cb);
//           return;
//         } else {
//           throw err;
//         }
//       }
      
//       // get current version nr
//       let new_nr = parseInt(data, 10) + 1;
      
//       fs.writeFile(config.version_file, new_nr, {encoding: 'utf8', flag: 'w'}, err => {
//         if (err) {
//           throw err;
//         }
        
//         cb();
//       });
      
//     });
// }
// base.gulp.task('increase-version', 'increases css/js version nr to prevent locale caching after a new build', false, increaseVersion);
