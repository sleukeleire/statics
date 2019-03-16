const del = require('del');
const through = require('through2');

module.exports = {
  remove: function () {
    return through.obj((file, enc, cb) => {
      del(file.path).then(() => {
        cb(null, file);
      });
    });
  }
};