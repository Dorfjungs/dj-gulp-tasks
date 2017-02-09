const gulp = require('gulp');
const rename = require('gulp-rename');
const run = require('gulp-run');

module.exports = (config) => {
	gulp.task('sassc-compile', () => {
		for (var i = 0, len = config.files.length; i < len; i++) {
			var files = config.files[i];
			var stream = gulp.src(files.entry)
				.pipe(run('sassc -t compressed -I ' + config.watch, {verbosity: 1}))
				.on('error', (err) => { stream.end(); })
			    .pipe(rename((path) => { path.extname = ".css"; }))
			    .pipe(gulp.dest(files.output));
		}
	});

	gulp.task('sassc-watch', () => {
		gulp.watch(config.watch + '/*.scss', ['sassc-compile'])
	});

	gulp.task('sassc', ['sassc-watch']);
};