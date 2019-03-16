# Statics - A static site generator
This is a boilerplate for a static site generated, which means it will build .html, .css and .js files. Using Node.js/Gulp (tested with Node.js __version 10.15.2__).
The goal of this project is to set up small websites without a CMS (though all content can be dynamic and multilingual, loaded from a .json file). For all your clients who want a custom designed website ASAP but do not update the content themselves.

# Global
Always work in the /src folder! The final result (html, js, css & assets) will be build in the /build folder. Except when you change the ./src/gulp/config.js to another build folder :)

# HTML
HTML that sits in the /src/html folder gets compiled (& minified) to the /build folder, this can be multiple html pages.
The templating library used in Nunjucks: https://mozilla.github.io/nunjucks/ which comes __very close to PHP's Twig__.

# JS
* JS that sits in the /src/js folder gets compiled (& minified) to /build/js/script.js .
  - The JS written before compilation is __ES6, which means it uses the latest JS syntax (import / classes / ...)__
* This boiler uses the last version of jQuery (downloaded by gulp). Old school :) , for those that __cannot let jQuery go__
* Gulp also builds a custom Modernizr, using only the Modernizr features used throughout the scss and js

# CSS
This boiler uses SASS, compiled by node (using Gulp). The sass sits in the /src/scss folder, this gets compiled (& minified when --production is used) to /build/css/style.css

# How to build
* Make sure node.js (tested with node version 10.15.2) is installed (preferably use https://github.com/Gizra/KnowledgeBase/wiki/How-to-install-nvm-(Node-Version-Manager), or the specific version: https://nodejs.org/en/download/)
* For image optimizing, make sure libjpeg and libpng are installed (https://www.npmjs.com/package/gulp-image)
* Use the following commands to get the needed node packages: 'npm install'
* After all needed node packages are installed, test out the command 'gulp', the default should be a help with all possible tasks
* Most used tasks will be:
  - ./gulp.sh watch => watches all needed files (see /src/gulp/config.js for which specific files)
  - ./gulp.sh build => builds and minifies everything in the /build folder
  - ./gulp.sh build --staging => builds, but does NOT minifies everything in the /build folder

# GULP
* Run './gulp.sh' for a help:
  - build             Builds js, css and html [scss-build, js-build, html-build]
   --production     Compiles compressed.
  - clean             Removes all generated files [js-clean, scss-clean, html-clean]
  - default           [help]
  - help              Display this help text.
  - html-build        Generates all HTML files
   --production     Minifies the HTML.
  - html-clean        cleans all compiled js, temp files included
  - html-watch        Start a watch task to watch all html.
   --production     Minifies the HTML.
  - js-build          Builds a single .js file with a sourcemap from a single entry point
   --production     Compiles compressed.
  - js-clean          cleans all compiled js, temp files included
  - js-concat         Builds a single .js file with a sourcemap from a single entry point (using babel & browserifiy)
   --production     Minifies the HTML.
  - js-jquery         gets latest jquery 2.x version and puts it in the tmp folder
  - js-lint           lints all configged js files
  - js-modernizr      uses gulp modernizr to find all modernizr needed properties in JS and SCSS and writes a modernizr.js file to tmp folder
  - js-watch          Start a watch task to lint and watch the js.
   --production     Minifies the HTML.
  - scss-build        Compile all sass files
   --production     Compiles compressed.
  - scss-clean        cleans all compiled css
  - scss-lint         lint all scss files
  - scss-watch        Start a watch task to lint and compile the scss.
  - watch             Start a watch task to compile all assets
