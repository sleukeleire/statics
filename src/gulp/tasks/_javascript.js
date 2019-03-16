// config
const config = require('../config').js;

// Initialize base variables
let base = require('../base').init();

const browserify  = require('browserify');
const babelify    = require('babelify');
const source      = require('vinyl-source-stream');
const buffer      = require('vinyl-buffer');

const jsConcat = function () {
  // app.js is your main JS file with all your module inclusions
  return browserify({entries: config.babel.entry, debug: true})
      .transform('babelify', {
        presets: [
          [
            '@babel/preset-env',
            {
              'targets': {
                'browsers': config.browser_targets
              }
            }
          ]
        ]
      })
      .bundle()
      .pipe(source('./' + config.babel.dest_filename))
      .pipe(buffer())
      .pipe(base.$.addSrc.prepend(config.babel.vendor_src))
      .pipe(base.$.if(!base.args.production, base.$.sourcemaps.init()))
      .pipe(base.$.concat(config.babel.dest_filename))
      .pipe(base.$.if(base.args.production, base.$.uglify()))
      .pipe(base.$.if(!base.args.production, base.$.sourcemaps.write('.')))
      .pipe(base.gulp.dest(config.babel.dest));
};
let jsConcatTask = base.gulp.series(jsConcat);
jsConcatTask.description = "Builds a single .js file with a sourcemap from a single entry point\n                              (using babel & browserifiy)";
jsConcatTask.options = {
  'production': 'Minifies the HTML.'
};
base.gulp.task('js-concat', jsConcatTask);
module.exports['js-concat'] = jsConcatTask;

// JQUERY
const jsJQuery = function () {
  return base.$.jquery.src({
    release: 2, //jQuery 2 
    // flags: ['-deprecated', '-event/alias', '-ajax/script', '-ajax/jsonp', '-exports/global']
  })
  // creates ./js/jquery.custom.js 
  .pipe(base.gulp.dest(config.tmp));
};
let jsJQueryTask = base.gulp.series(jsJQuery);
jsJQueryTask.description = 'gets latest jquery 2.x version and puts it in the tmp folder';
base.gulp.task('js-jquery', jsJQueryTask);
module.exports['js-jquery'] = jsJQueryTask;

// MODERNIZR
const jsModernizr = function () {
  return base.gulp
  .src(config.modernizr.src)
  .pipe(base.$.modernizrBuild(config.modernizr.filename, {
    'options' : [
      'setClasses',
    ],
    'addFeatures': [
      'touchevents'
    ]
  }))
  .pipe(base.gulp.dest(config.tmp));
};
let jsModernizrTask = base.gulp.series(jsModernizr);
jsModernizrTask.description = "uses gulp modernizr to find all modernizr needed properties in JS and\n                              SCSS and writes a modernizr.js file to tmp folder";
base.gulp.task('js-modernizr', jsModernizrTask);
module.exports['js-modernizr'] = jsModernizrTask;

// CLEANER
const jsCleaner = function () {
  return base.gulp
  .src(config.clean, {allowEmpty: true})
  .pipe(base.debug.log_files('remove'))
  .pipe(base.files.remove());
};
let jsCleanerTask = base.gulp.series(jsCleaner);
jsCleanerTask.description = 'cleans all compiled js, temp files included';
base.gulp.task('js-clean', jsCleanerTask);
module.exports['js-clean'] = jsCleanerTask;

// BUILD
let jsBuildTask = base.gulp.series(['js-clean'], base.gulp.parallel(['js-jquery', 'js-modernizr']), ['js-concat']);
jsBuildTask.description = 'Builds a single .js file with a sourcemap from a single entry point';
jsBuildTask.subTasks = 'SERIES([js-clean, PARALLEL([js-jquery, js-modernizr]), js-concat])';
jsBuildTask.options = {
  'production': 'Compiles compressed.'
};
base.gulp.task('js-build', jsBuildTask);
module.exports['js-build'] = jsBuildTask;

// LINTER
const jsLint = function () {
  return base.gulp
  .src(config.lint)
  .pipe(base.$.print.default())
  // eslint() attaches the lint output to the "eslint" property 
  // of the file object so it can be used by other modules. 
  .pipe(base.$.eslint())
  // eslint.format() outputs the lint results to the console. 
  // Alternatively use eslint.formatEach() (see Docs). 
  .pipe(base.$.eslint.format())
  // To have the process exit with an error code (1) on 
  // lint error, return the stream and pipe to failAfterError last. 
  .pipe(base.$.eslint.failAfterError());
};
const jsLintTask = base.gulp.series(jsLint);
jsLintTask.description = 'lints all configged js files';
base.gulp.task('js-lint', jsLintTask);
module.exports['js-lint'] = jsLintTask;

// WATCHER
const jsWatch = function () {
  // watch all js, then run js-lint first, then js-build to compile it:
  base.gulp.watch(config.watch, base.gulp.series(['js-lint', 'js-build']));
};
// first do js-lint once, then build once, then start watching:
const jsWatchTask = base.gulp.series(['js-lint', 'js-build', jsWatch]);
jsWatchTask.description = 'Start a watch task to lint and watch the js.';
jsWatchTask.subTasks = 'SERIES([js-lint, js-build, js-watch])';
jsWatchTask.options = {
  'production': 'Minifies the HTML.'
};
base.gulp.task('js-watch', jsWatchTask);
module.exports['js-watch'] = jsWatchTask;
