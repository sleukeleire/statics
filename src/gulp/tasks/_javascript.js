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
jsConcat.description = 'Builds a single .js file with a sourcemap from a single entry point (using babel & browserifiy)';
const jsConcatTask = base.gulp.series(jsConcat);
base.gulp.task('js-concat', jsConcatTask, {
  options: {
      'production': 'Minifies the HTML.'
  }
});

const jsJQuery = function () {
  return base.$.jquery.src({
    release: 2, //jQuery 2 
    // flags: ['-deprecated', '-event/alias', '-ajax/script', '-ajax/jsonp', '-exports/global']
  })
  // creates ./js/jquery.custom.js 
  .pipe(base.gulp.dest(config.tmp));
};
jsJQuery.description = 'gets latest jquery 2.x version and puts it in the tmp folder';
const jsJQueryTask = base.gulp.series(jsJQuery);
// JQUERY
base.gulp.task('js-jquery', jsJQueryTask);

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
jsModernizr.description = 'uses gulp modernizr to find all modernizr needed properties in JS and SCSS and writes a modernizr.js file to tmp folder';
const jsModernizrTask = base.gulp.series(jsModernizr);
base.gulp.task('js-modernizr', jsModernizrTask);

// CLEANER
const jsCleaner = function () {
  return base.gulp
    .src(config.clean, {allowEmpty: true})
    .pipe(base.debug.log_files('remove'))
    .pipe(base.files.remove());
};
jsCleaner.description = 'cleans all compiled js, temp files included';
const jsCleanerTask = base.gulp.series(jsCleaner);
base.gulp.task('js-clean', jsCleanerTask);

// BUILD
let jsBuildTask = base.gulp.series(['js-clean'], base.gulp.parallel(['js-jquery', 'js-modernizr']), ['js-concat']);
jsBuildTask.description = 'Builds a single .js file with a sourcemap from a single entry point';
base.gulp.task('js-build', jsBuildTask, {
  options: {
      'production': 'Compiles compressed.'
  }
});

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
jsLint.description = 'lints all configged js files';
const jsLintTask = base.gulp.series(jsLint);
base.gulp.task('js-lint', jsLintTask);

// WATCHER
const jsWatch = function () {
  // watch all js, then run js-lint first, then js-build to compile it:
  base.gulp.watch(config.watch, base.gulp.series(['js-lint', 'js-build']));
};
jsWatch.description = 'Start a watch task to lint and watch the js.';
// first do js-lint once, then build once, then start watching:
const jsWatchTask = base.gulp.series(['js-lint', 'js-build', jsWatch]);
base.gulp.task('js-watch', jsWatchTask, {
  options: {
      'production': 'Minifies the HTML.'
  }
});
