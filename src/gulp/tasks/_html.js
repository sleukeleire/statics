// ---
// HTML
// ---

// config
const config = require('../config').html;
const cssConfig = require('../config').scss;

// base
const base = require('../base').init();

// other needed modules
const fs = require('fs');
const critical = require('critical').stream;

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

// BUILD
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
  .pipe(base.$.if(base.args.production, critical({  // for production, generate critical css
    'base': config.root,
    'inline': true,
    'css': [
      cssConfig.dest + '/' + cssConfig.dest_filename
    ],
    'dimensions': cssConfig.inline_css_dimensions
  })))
  .on('error', function(err) {
    base.$.util.log(base.$.util.colors.red(err.message));
  })
  .pipe(base.$.if(base.args.production, base.$.htmlmin({  // for production, minify the code
    'collapseWhitespace': true,
    'removeComments': true,
    'minifyJS': true,
    'minifyCSS': true
  })))
  .pipe(base.debug.log_files('copy'))
  // output files in app folder
  .pipe(base.gulp.dest(config.dest));
};
let htmlBuildTask = base.gulp.series([htmlClean, htmlBuild]);
htmlBuildTask.description = 'Generates all HTML files';
htmlBuildTask.subTasks = 'SERIES([html-clean, html-build])';
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
