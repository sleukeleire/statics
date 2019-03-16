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
  console.log('  TASK NAME                   TASK DESCRIPTION                                            SUBTASKS');
  console.log('    --OPTIONNAME               OPTION DESCRIPTION');
  console.log('  ---------------------------------------------------------------------------------------------------------------------------');
  console.log('  default                     This help!');
  console.log('  help                        This help again :)');
  Object.keys(reqs).forEach(moduleName => {
    // console.log(moduleName);
    Object.keys(reqs[moduleName]).forEach(taskName => {
      const taskInfo = reqs[moduleName][taskName];
      let base = `  ${taskName}`;
      while (base.length < 30) {
        base += ' ';
      }
      if (taskInfo.description) {
        base += taskInfo.description;
      }
      if (taskInfo.subTasks) {
        while(base.length < 90) {
          base += ' ';
        }
        base += taskInfo.subTasks;
      }
      console.log(base);
      if (taskInfo.options) {
        Object.keys(taskInfo.options).forEach(optionName => {
          let optionLine = `    --${optionName}`;
          while(optionLine.length < 30) {
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
const helpTask = base.gulp.series(help);
base.gulp.task('default', helpTask);
base.gulp.task('help', helpTask);
