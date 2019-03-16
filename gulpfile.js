/*
 gulpfile.js
 ===========
 */

// required gulp modules
var requireDir = require('require-dir');

// Require all tasks, including subfolders
requireDir('./src/gulp/tasks', { recurse: true });