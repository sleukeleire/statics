// reusable paths
const root = './';
const src = root + 'src/';
const build = root + 'build/';
const tmp = root + 'tmp/';

module.exports = {
  root: root,

  data: {
    path: src + 'html/data',
  },

  scss: {
    src: src + 'scss/style.scss',
    dest_filename: 'style.css',
    build: build,
    dest_folder: 'css',
    clean: [
      root + 'tmp/*.css',
      build + '**/css',
    ],
    lint: {
      files: src + 'scss/**/*.scss',
      extends: 'stylelint-config-standard',
      plugins: [
        'stylelint-scss'
      ],
      rules: { // Find all rules @ http://stylelint.io/user-guide/rules
        'number-leading-zero': null,
        'declaration-no-important' : true,
        'at-rule-no-unknown': [
          true,
          {
            ignoreAtRules: [
              'if',
              'else',
              'function',
              'return',
              'warn',
              'mixin',
              'each',
              'include',
              'content'
            ]
          }
        ]
      },
      easings: {
        // Add custom easings here. Default easings are those from easings.net
      }
    },
    // uses https://github.com/ai/browserslist
    prefix: [ // Autoprefixer supported browsers (keep this in sync with your babel-preset-env browser targets unless you know what you are doing)
      'last 2 version',
      '> 1%',
      'iOS 7',
      'Android 4',
      'IE 11',
      'IE 10'
    ],
    watch: src + 'scss/**/*.scss',
    inline_css_dimensions: [
      {
        'height': 568,
        'width': 320
      },
      {
        'height': 768,
        'width': 640
      },
      {
        'height': 1080,
        'width': 1920
      }
    ]
  },

  js: {
    build: build,
    dest_folder: 'js',
    babel: {
      entry: src + 'js/main.js',
      dest_filename: 'script.js',
      vendor_src: [
        // this is project dependent, the vendor JS libs to addEventListener
        // EXAMPLE FROM https://reind.be/portfolio :
  
        // src + 'js/vendor/iscroll/build/iscroll.js',
        // src + 'js/vendor/loadCSS/src/loadCSS.js',
        // src + 'js/vendor/loadCSS/src/cssrelpreload.js',
        // src + 'js/vendor/loadCSS/src/onloadCSS.js',
  
        // -- //
        tmp + 'jquery.custom.js',
        // also project dependent: plugins that need jquery must be loaded after jquery is loaded:
        // EXAMPLE FROM https://reind.be/portfolio :
        // src + 'js/vendor/jquery/jquery.touchSwipe.js',
        // -- //
        tmp + 'modernizr.js'
      ]
    },
    modernizr: {
      src: [
        src + 'js/classes/**/*.js',
        src + 'js/main.js',
        src + 'scss/**/*.scss'
      ],
      filename: 'modernizr.js',
      dest: root + 'tmp'
    },
    // sourcemap_dest: build,
    dest_filename: 'script.js',
    tmp: root + 'tmp', // without trailing slash
    lint: [
      src + 'js/**/*.js',
      '!' + src + 'js/vendor/**/*.js',
    ],
    watch: [
      src + 'js/**/*.js', // all js files
      src + 'scss/**/*.scss' // and all scss files (for modernizr)
    ],
    clean: [
      root + 'tmp/*.js',
      build + 'js'
    ],
    browser_targets: [ // babel-preset-env browser targets (keep this in sync with your autoprefixer supported browsers unless you know what you are doing)
      'last 2 version',
      '> 1%',
      'iOS 7',
      'Android 4',
      'IE 11',
      'IE 10'
    ]
  },

  html: {
    src: src + 'html/pages/**/*.njk',
    partials: src + 'html/partials',
    dest: build,
    watch: [
      src + 'html/**/*.njk',
      src + 'html/data/**/*.json'
    ],
    clean: build + '**/*.html',
  },

  images: {
    src_svgs: src + 'img/**/*.svg',
    src: [
      src + 'img/**/*.jpg',
      src + 'img/**/*.jpeg',
      src + 'img/**/*.png',
      src + 'img/**/*.gif',
    ],
    build: build,
    dest_folder: 'img',
    clean: [
      build + '**/img/**/*.svg',
      build + '**/img/**/*.jpg',
      build + '**/img/**/*.jpeg',
      build + '**/img/**/*.png',
      build + '**/img/**/*.gif',
      build + '**/img',
    ],
    watch: {
      svg: src + 'img/**/*.svg',
      other: [
        src + 'img/**/*.jpg',
        src + 'img/**/*.jpeg',
        src + 'img/**/*.png',
        src + 'img/**/*.gif',
      ]
    }
  },

  fonts: {
    src: [
      src + 'fonts/**/*.woff',
      src + 'fonts/**/*.woff2'
    ],
    dest: build + 'fonts',
    clean: [
      build + 'fonts/**/*.woff',
      build + 'fonts/**/*.woff2'
    ],
    watch: [
      src + 'fonts/**/*.woff',
      src + 'fonts/**/*.woff2'
    ]
  },

  build: {
    version_file: src + 'css_js_version_nr.txt',
    // set to true to include above the fold css (needs a placeholder in the html files though!)
    include_critical_css: false
  },

  output: {
    loglevel: 100
  },

  clean: src + 'build'
};
