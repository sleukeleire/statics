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

// CLEANER
const scssClean = function () {
  return base.gulp
  .src(config.clean, {allowEmpty: true})
  .pipe(base.debug.log_files('remove'))
  .pipe(base.files.remove());
  
};
let scssCleanTask = base.gulp.series(scssClean);
scssCleanTask.description = 'cleans all compiled css';
base.gulp.task('scss-clean', scssCleanTask);
module.exports['scss-clean'] = scssCleanTask;

// TASKS
const scssBuildOneLanguage = function (locale, data, cb) {
  // build localized dest
  const dest = config.build + (locale ? `/${locale}/` : '/') + config.dest_folder;

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
    .pipe(base.gulp.dest(dest))
    .on('end', () => {
      cb();
    });
};
const scssBuild = function (cb) {
  base.locale.langsFromDataJsons(scssBuildOneLanguage, cb);
};
let scssBuildTask = base.gulp.series([scssCleanTask, scssBuild]);
scssBuildTask.description = 'Compile all sass files';
scssBuildTask.subTasks = 'SERIES([scss-clean, scss-build])';
scssBuildTask.options = {
  'production': 'Compiles compressed.'
};
base.gulp.task('scss-build', scssBuildTask);
module.exports['scss-build'] = scssBuildTask;

// LINTER
const scssLint = function () {
  base.debug.log('Linting .scss files.');
  
  return base.gulp
  .src(config.lint.files)
  .pipe(base.debug.log_files('lint'))
  .pipe(base.$.postcss(linterProcessors, {syntax: scssSyntax}));
};
let scssLintTask = base.gulp.series(scssLint);
scssLintTask.description = 'lint all scss files';
base.gulp.task('scss-lint', scssLintTask);
module.exports['scss-lint'] = scssLintTask;

// WATCHER
const scssWatch = function () {
  base.gulp.watch(config.watch, base.gulp.series(['scss-lint', 'scss-build']));
}
// first do scss-lint once, then scss (compile) once, then start watching:
let scssWatchTask = base.gulp.series(['scss-lint', 'scss-build', scssWatch]);
scssWatchTask.description = 'Start a watch task to lint and compile the scss.';
base.gulp.task('scss-watch', scssWatchTask);
module.exports['scss-watch'] = scssWatchTask;
