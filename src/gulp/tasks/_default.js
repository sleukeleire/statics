// ---
// DEFAULT
// ---

// base
const base = require('../base').init();

// required dir
var requireDir = require('require-dir');

// logs a single table's row
const logRow = (...cells) => {
  let str = '  ';
  let minLength = 30;
  cells.forEach(cell => {
    if (typeof(cell) === 'undefined') return;
    
    str += cell;
    while (str.length < minLength) {
      str += ' ';
    }
    minLength += 80;
  });
  console.log(str);
};

// tasks
const help = function (cb) {
  // Require all tasks, including subfolders
  const reqs = requireDir('.', { recurse: true });
  console.log("\n");
  logRow('TASK NAME', 'TASK DESCRIPTION', 'SUBTASKS');
  logRow('   --OPTIONNAME', 'OPTION DESCRIPTION');
  console.log('  ---------------------------------------------------------------------------------------------------------------------------');
  logRow('default', 'This help!');
  logRow('help', 'This help again :)');
  Object.keys(reqs).forEach(moduleName => {
    // console.log(moduleName);
    Object.keys(reqs[moduleName]).forEach(taskName => {
      const taskInfo = reqs[moduleName][taskName];

      logRow(taskName, taskInfo.description, taskInfo.subTasks);

      if (taskInfo.options) {
        Object.keys(taskInfo.options).forEach(optionName => {
          logRow(`    --${optionName}`, taskInfo.options[optionName]);
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
