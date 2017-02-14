const gulp = require('gulp');
const rename = require('gulp-rename');
const ignore = require('gulp-ignore');
const run = require('gulp-run');

module.exports = (config) => {
	gulp.task('sassc-compile', (callback) => {
		setTimeout(() => {
			let promises = [];

			for (let i = 0, len = config.files.length; i < len; i++) {
				promises.push(new Promise((resolve, reject) => {
					let files = config.files[i];
					let paths = config.watch + (config.paths ? (':' + config.paths.join(':')) : '');
					let stream = gulp.src(files.entry)
						.pipe(ignore.exclude('_*.scss'))
						.pipe(ignore.exclude('**/_*.scss'))
						.pipe(run('sassc -s -t compressed -I ' + paths, {verbosity: 1}))
						.on('error', (err) => {stream.end();reject(err);})
						.pipe(rename((path) => { path.extname = ".css"; }))
						.pipe(gulp.dest(files.output))
						.on('finish', () => {setTimeout(resolve, 0);});
				}));
			}

			Promise.all(promises).then(() => callback());
		}, !isNaN(config.timeout) ? config.timeout : 50);
	});

	gulp.task('sassc-watch', () => {
		gulp.watch(config.watch + '/**/*.scss', ['sassc-compile'])
	});

	gulp.task('sassc', ['sassc-watch']);
};