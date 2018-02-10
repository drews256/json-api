// Karma configuration
// Generated on Thu Feb 01 2018 14:40:56 GMT-0800 (PST)

var path = require('path')
const Dotenv = require('dotenv-webpack')

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],

    // list of files / patterns to load in the browser
    files: [
      './test/**/*.test.js',
      { pattern: `./src/**/*.js`, included: false, watched: true }
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './src/**/*.js': ['webpack'],
      './test/**/*.js': ['webpack']
    },

    webpack: {
      // generate sourcemaps
      entry: './src/index.js',
      resolve: {
        extensions: ['.js', '.jsx', '.css', '.scss']
      },
      module: {
        // use same loaders as Create React App
        loaders: [
          {
            exclude: [
              /\.(js|jsx)$/,
              /\.css$/,
              /\.json$/
            ],
            loader: 'file-loader',
            query: {
              name: 'static/media/[name].[hash:8].[ext]'
            }
          },
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query:
            {
              presets: ['react', 'es2017'],
              plugins: [
                'babel-root-slash-import',
                'transform-object-rest-spread',
                'transform-class-properties'
              ]
            }
          },
          {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
          },
          {
            test: /\.scss$/,
            loader: 'style-loader!sass-loader'
          },
          {
            test: /\.json$/,
            loader: 'json-loader'
          }
        ]
      },
      plugins: [
        new Dotenv({
          path: './.env.development'
        })
      ]
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: [ 'dots' ],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,
    usePolling: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  })
}
