// ---
// DEFAULT
// ---

// base
const base = require('../base').init();

// required dir
var requireDir = require('require-dir');


// tasks
const help = function (cb) {
  // Require all tasks, including subfolders
  const reqs = requireDir('.', { recurse: true });
  console.log("\n");
  console.log('  TASK NAME         TASK DESCRIPTION                                  SUBTASKS');
  console.log('   --OPTIONNAME     OPTION DESCRIPTION');
  console.log('  -------------------------------------------------------------------------');
  Object.keys(reqs).forEach(moduleName => {
    Object.keys(reqs[moduleName]).forEach(taskName => {
      const taskInfo = reqs[moduleName][taskName];
      let base = `  ${taskName}`;
      while (base.length < 20) {
        base += ' ';
      }
      if (taskInfo.description) {
        base += taskInfo.description;
      }
      if (taskInfo.subTasks) {
        while(base.length < 70) {
          base += ' ';
        }
        base += taskInfo.subTasks;
      }
      console.log(base);
      if (taskInfo.options) {
        Object.keys(taskInfo.options).forEach(optionName => {
          let optionLine = `   --${optionName}`;
          while(optionLine.length < 20) {
            optionLine += ' ';
          }
          optionLine += taskInfo.options[optionName];
          console.log(optionLine);
        });
      }
    });
  });
  console.log("\n");
  cb();
};
base.gulp.task('default', base.gulp.series(help));
base.gulp.task('help', base.gulp.series(help));