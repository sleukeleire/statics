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

let htmlBuild = function (cb) {
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
htmlBuild.description = 'Generates all HTML files';
const htmlBuildTask = base.gulp.series(htmlBuild);
base.gulp.task('html-build', htmlBuildTask, {
  options: {
      'production': 'Minifies the HTML.'
  }
});

// WATCHER
let htmlWatch = function () {
  // watch all files in config.scss
  base.gulp.watch(config.watch, htmlBuild);
};
htmlWatch.description = 'Start a watch task to watch all html.';
const htmlWatchTask = base.gulp.series([htmlBuild, htmlWatch]);
base.gulp.task('html-watch', htmlWatchTask, {
  options: {
      'production': 'Minifies the HTML.'
  }
});

// // CLEANER
let htmlClean = function () {
  return base.gulp
    .src(config.clean)
    .pipe(base.debug.log_files('remove'))
    .pipe(base.files.remove());
};
htmlClean.description = 'cleans all compiled js, temp files included';
const htmlCleanTask = base.gulp.series(htmlClean);
base.gulp.task('html-clean', htmlCleanTask);
