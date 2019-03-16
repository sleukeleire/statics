// ---
// HTML
// ---

// config
const config = require('../config').html;

// base
const base = require('../base').init();

// other needed modules
const fs = require('fs');
// const critical = require('critical').stream;

const htmlBuild = function (cb) {
  // data as json
  const data = JSON.parse(fs.readFileSync(config.data, 'utf8'));

  // Gets .njk files in pages
  return base.gulp.src(config.src)
  .pipe(base.$.plumber())
  // Adding data to Nunjucks
  .pipe(base.$.data(data))
  // Renders template with nunjucks
  .pipe(base.$.nunjucksRender({
    path: [config.partials]
  }))
  // @TODO, add critical css inline
  // .pipe(base.$.if(base.args.production, critical({  // for production, generate critical css
  //   'base': config.root + langcode,
  //   'inline': true,
  //   'css': [
  //     './css/style.css'
  //   ],
  //   'dimensions': [{
  //     'height': 568,
  //     'width': 320
  //   },
  //   {
  //     'height': 768,
  //     'width': 640
  //   },
  //   {
  //     'height': 1080,
  //     'width': 1920
  //   }]
  // })))
  .pipe(base.$.if(base.args.production, base.$.htmlmin({  // for production, minify the code
    'collapseWhitespace': true,
    'removeComments': true,
    'minifyJS': true,
    'minifyCSS': true
  })))
  // output files in app folder
  .pipe(base.gulp.dest(config.dest));
};
let htmlBuildTask = base.gulp.series(htmlBuild);
htmlBuildTask.description = 'Generates all HTML files';
htmlBuildTask.options = {
  'production': 'Minifies the HTML.'
};
base.gulp.task('html-build', htmlBuildTask);
module.exports['html-build'] = htmlBuildTask;

// WATCHER
const htmlWatch = function () {
  // watch all files in config.scss
  base.gulp.watch(config.watch, htmlBuild);
};
let htmlWatchTask = base.gulp.series([htmlBuild, htmlWatch]);
htmlWatchTask.description = 'Start a watch task to watch all html.';
htmlWatchTask.subTasks = 'SERIES([html-build, html-watch])';
htmlWatchTask.options = {
  'production': 'Minifies the HTML.'
};
base.gulp.task('html-watch', htmlWatchTask);
module.exports['html-watch'] = htmlWatchTask;

// // CLEANER
const htmlClean = function () {
  return base.gulp
    .src(config.clean)
    .pipe(base.debug.log_files('remove'))
    .pipe(base.files.remove());
};
let htmlCleanTask = base.gulp.series(htmlClean);
htmlCleanTask.description = 'cleans all compiled js, temp files included';
base.gulp.task('html-clean', htmlCleanTask);
module.exports['html-clean'] = htmlCleanTask;
