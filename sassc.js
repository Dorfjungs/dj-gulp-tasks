const gulp = require('gulp');
const path = require('path');
const ignore = require('gulp-ignore');
const watch = require('gulp-watch');
const shell = require('gulp-shell');
const flatmap = require('gulp-flatmap');
const windows = /^win/.test(process.platform);
const pathSep = windows ? ';' : ':';

module.exports = {
    compile: (config, callback) => {
        setTimeout(() => {
            let promises = [];

            for (let i = 0, len = config.files.length; i < len; i++) {
                promises.push(new Promise((resolve, reject) => {
                    let files = config.files[i];
                    let paths = config.watch + (config.paths ? (pathSep + config.paths.join(pathSep)) : '');

                    if (windows) {
                        paths = paths.replace(/\.\//g, '');
                    }

                    gulp.src(files.entry)
                        .pipe(ignore.exclude('_*.scss'))
                        .pipe(ignore.exclude('**/_*.scss'))
                        .pipe(flatmap((stream, file) => {
                            const filename = path.parse(file.path).name;

                            return stream.pipe(
                                shell(`sassc -t compressed -I ${paths} ${file.path} ${files.output}/${filename}.css`, { verbose: true })
                            );
                        }))
                        .on('error', () => setTimeout(resolve, 0))
                        .on('finish', () => setTimeout(resolve, 0));
                }));
            }

            Promise.all(promises).then(() => callback ? callback() : {});
        }, !isNaN(config.timeout) ? config.timeout : 50);
    },
    watch: (config, callback) => {
        return watch(config.watch + '/**/*.scss', callback);
    }
};

/** @depcrecated */
module.exports.default = (config, optPostfix) => {
    var postfix = optPostfix ? ('-' + optPostfix) : '';

    gulp.task('dj-sassc-compile' + postfix, (callback) => {
        return module.exports.compile(config, callback);
    });

    gulp.task('dj-sassc-watch' + postfix, () => {
        return module.exports.watch(config, () => gulp.start('dj-sassc-compile' + postfix));
    });

    gulp.task('dj-sassc' + postfix, ['dj-sassc-watch' + postfix]);
};