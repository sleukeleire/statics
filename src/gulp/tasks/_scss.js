// ---
// SCSS
// ---

// config
const config = require('../config').scss;

// base
const base = require('../base').init();

// autoprefixer
const autoprefixer = require('autoprefixer');
const easings = require('postcss-easings');
const stylelint = require('stylelint');
const reporter = require('postcss-reporter');
const scssSyntax = require('postcss-scss');
const processors = [
  autoprefixer(config.prefix),
  easings(config.easings)
];

const linterProcessors = [
  stylelint(config.lint),
  autoprefixer(config.prefix),
  reporter({
    clearMessages: true
  })
];

// TASKS
let scssBuild = function () {
  // Variables/config
  let sass_settings = {
    outputStyle: base.args.production ? 'compressed' : 'nested',
    sourceComments: !base.args.production,
    precision: 10
  };

  // Log some info to the CLI
  base.debug.log('Compiling .scss files' + (base.args.production ? ' for production' : ''));

  // execute task
  return base.gulp
    .src(config.src)
    .pipe(base.debug.log_files('compile'))
    .pipe(base.$.sassGlob())
    .pipe(base.$.sass(sass_settings).on('error', base.$.sass.logError))
    .pipe(base.$.postcss(processors))
    .pipe(base.debug.log_files('copy'))
    .pipe(base.gulp.dest(config.dest));
};
scssBuild.description = 'Compile all sass files';
const scssBuildTask = base.gulp.series(scssBuild);
base.gulp.task('scss-build', scssBuildTask, {
  options: {
      'production': 'Compiles compressed.'
  }
});

// LINTER
let scssLint = function () {
  base.debug.log('Linting .scss files.');

  return base.gulp
      .src(config.lint.files)
      .pipe(base.debug.log_files('lint'))
      .pipe(base.$.postcss(linterProcessors, {syntax: scssSyntax}));
};
scssLint.description = 'lint all scss files';
const scssLintTask = base.gulp.series(scssLint);
base.gulp.task('scss-lint', scssLintTask);

// WATCHER
let scssWatch = function () {
  base.gulp.watch(config.watch, base.gulp.series(['scss-lint', 'scss-build']));
}
scssWatch.description = 'Start a watch task to lint and compile the scss.';
// first do scss-lint once, then scss (compile) once, then start watching:
const scssWatchTask = base.gulp.series(['scss-lint', 'scss-build', scssWatch]);
base.gulp.task('scss-watch', scssWatchTask);

// CLEANER
let scssClean = function () {
  return base.gulp
    .src(config.dest)
    .pipe(base.debug.log_files('remove'))
    .pipe(base.files.remove());
  
};
scssClean.description = 'cleans all compiled css';
base.gulp.task('scss-clean', scssClean);
