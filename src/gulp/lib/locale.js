/**
 * locale.js - contains logic concerning the multilingual aspect of this site gen
 */

// config
const config = require('../config').data;

// needed modules
const fs = require('fs');

// module exports
module.exports = {
  /**
   * 
   * @param {function} processor - Gets called with the locale as first param, the data as second param and the callback when finished as 3th param
   * @param {function} cb - Gets called when all langs are done processing
   * 
   * @returns {undefined}
   */
  langsFromDataJsons: (processor, cb) => {
    // build all languages (one per data .json file), can include an empty string (which will sit in the root of /build)
    const dataFiles = fs.readdirSync(config.path, 'utf8');
    if (dataFiles && Array.isArray(dataFiles)) {
      let cntProcessed = 0;
      for (let i in dataFiles) {
        // find locale by filename
        const filename = dataFiles[i];
        const filepath = `${config.path}/${filename}`;
        // data as json
        const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        const arrFilename = filename.split('--');
        let locale = '';
        if (arrFilename.length > 1) {
          const arrLocaleExtension = arrFilename[1].split('.');
          locale = arrLocaleExtension[0] ? arrLocaleExtension[0] : locale;
        }
        
        // process once for this locale, when all processes is done, call the callback
        processor(locale, data, () => {
          if (++cntProcessed >= dataFiles.length) {
            cb();
          }
        });
      }
    }
  }
};
