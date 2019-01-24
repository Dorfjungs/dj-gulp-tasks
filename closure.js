const gulp = require('gulp');
const watch = require('gulp-watch');
const rename = require('gulp-rename');
const closureCompiler = require('google-closure-compiler').gulp();

module.exports = {
  depsBuild: (config) => {
    // This needs to be imported on demand, because it
    // contains a bug, where the files will not be resetted unless
    // you reimport this module. So in order to do that, we
    // (re)import it here and clear the require cache from node
    const closureDeps = require('gulp-google-closure-deps');

    var outputParts = config.output.split('/');
    var fileName = outputParts.pop();
    var outputPath = outputParts.join('/');

    return gulp.src(config.files)
      .pipe(closureDeps({
        'closurePath': config.closurePath
      }))
      .pipe(rename(fileName))
      .pipe(gulp.dest(outputPath))
      .on('end', () => {
        delete require.cache[
          require.resolve('gulp-google-closure-deps')
        ];
      });
  },
  depsWatch: (config, callback) => {
    return watch(config.files, callback);
  },
  distCompile: (config) => {
    var outputParts = config.output.split('/');
    var fileName = outputParts.pop();
    var outputPath = outputParts.join('/');
    var defaultConfig = {
      'generate_exports': '1',
      'only_closure_dependencies': '1',
      'compilation_level': 'ADVANCED',
      'warning_level': 'VERBOSE',
      'output_wrapper': '(function(){\n%output%\n})()',
      'js_output_file': fileName,
    };

    return gulp.src(config.files)
      .pipe(closureCompiler(Object.assign(defaultConfig, config.config)))
      .pipe(gulp.dest(outputPath));
  },

  /**
   * @depcrecated
   */
  deps: (config, optPostfix) => {
    var postfix = optPostfix ? ('-' + optPostfix) : '';

    gulp.task('dj-closure-deps' + postfix, () => this.depsBuild(config));
    gulp.task('dj-closure-deps-watch' + postfix, () => this.depsWatch(config));
  },
  compile: (config, optPostfix) => {
    var postfix = optPostfix ? ('-' + optPostfix) : '';

    gulp.task('dj-closure-compile' + postfix, () => this.distCompile(config));
  }
};
