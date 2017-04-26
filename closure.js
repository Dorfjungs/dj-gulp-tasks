const gulp = require('gulp');
const watch = require('gulp-watch');
const closureDeps = require('gulp-closure-deps');
const closureCompiler = require('google-closure-compiler').gulp();

module.exports = {
	deps: (config, optPostfix) => {
		var outputParts = config.output.split('/');
		var fileName = outputParts.pop();
		var outputPath = outputParts.join('/');
		var postfix = optPostfix ? ('-' + optPostfix) : '';

		gulp.task('dj-closure-deps' + postfix, () => {
			return gulp.src(config.files)
				.pipe(closureDeps({
					'fileName': fileName,
					'prefix': config.prefix
				}))
				.pipe(gulp.dest(outputPath));
		});

		gulp.task('dj-closure-deps-watch' + postfix, () => {
			return watch(config.files, () => gulp.start('dj-closure-deps' + postfix));
		});
	},
	compile: (config, optPostfix) => {
		var postfix = optPostfix ? ('-' + optPostfix) : '';

		gulp.task('dj-closure-compile' + postfix, () => {
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
		})
	}
};