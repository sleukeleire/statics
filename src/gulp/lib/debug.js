// lib/debug.js
const through = require('through2');
const $ = require('gulp-load-plugins')({lazy: true});
const config = require('../config');

module.exports = {
  LOG_LEVELS: {
    DEBUG: 100,
    INFO: 200,
    WARNING: 300,
    ERROR: 400
  },

  log_files: function (label) {
    return through.obj((file, enc, cb) => {
      this.log(label + ": " + file.path, this.LOG_LEVELS.DEBUG);
      cb(null, file);
    });
  },

  log: function (msg, level) {
    let cprint;
    if (level === undefined) level = this.LOG_LEVELS.INFO;

    switch(level) {
      case this.LOG_LEVELS.DEBUG:
        cprint = $.util.colors.dim;
      break;
      case this.LOG_LEVELS.INFO:
        cprint = $.util.colors.green;
      break;
      case this.LOG_LEVELS.WARNING:
        cprint = $.util.colors.yellow;
      break;
      case this.LOG_LEVELS.ERROR:
        cprint = $.util.colors.red;
      break;
    }

    if (config.output.loglevel <= level) {
      if (typeof(msg) === 'object') {
        for (let item in msg) {
          if (msg.hasOwnProperty(item)) {
            $.util.log($.util.colors.underline.bold.italic.cyan(item+':'), cprint(msg[item]));
          }
        }
      } else {
        $.util.log(cprint(msg));
      }
    }
  }
};