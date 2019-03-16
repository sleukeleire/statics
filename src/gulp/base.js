module.exports = {
  init: function () {
    // @TODO, get gulp-help working...
    // this.gulp = require('gulp-help')(require('gulp'));
    this.gulp = require('gulp');
    const gulpLoadPlugins = require('gulp-load-plugins');
    this.$ = gulpLoadPlugins({ lazy: true }); // lazy load all gulp-plugins, name is $.<pluginNameHere>;
    this.config = require('./config');
    this.debug = require('./lib/debug');
    this.files = require('./lib/files');
    this.args = require('./lib/args');
    this.tmpFolder = './.tmp/';

    return this;
  }
};