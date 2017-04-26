# Gulp tasks

Useful tasks with an easy setup, which keeps your gulpfile clean!

## sassc (with libsass)

Compile and watch sass files

### External Dependencies
- LibSass

#### Quick install
##### LibSass (with homebrew for OSX)
```bash
brew install libsass
```
### Usage
```javascript
const sassc = require('./gulp-tasks/sassc.js');

sassc({
  'watch': './styles/scss',
  'files': [
    {
      'entry': './styles/scss/*.scss',
      'output': './styles/css'
    }
  ]
}, 'optional-postfix');
```
This will automatically creates the following tasks ready to be executed:
- dj-sassc(-*)
- dj-sassc-watch(-*)
- dj-sassc-compile(-*)

> (-*): Optional postfix

## closure deps (with gulp-closure-deps)
### Usage

```javascript
const closure = require('dj-gulp-tasks/closure');

closure.deps({
  'prefix': '../../../../',
  'output': './resources/javascript/depsfile.deps.js',
  'files': [
    './resources/javascript/src/**/*.js',
    './node_modules/dj-library/**/*.js'
  ]
});
```

This will automatically creates the following tasks ready to be executed:
- dj-closure-deps(-*)
- dj-closure-deps-watch(-*)

> (-*): Optional postfix

## closure compile (with google-closure-compiler)
### Usage
```javascript
closure.compile({
  'output': './resources/javascript/application.min.js',
  'files': [
    './resources/javascript/src/**/*.js',
    './node_modules/google-closure-library/closure/goog/**/*.js',
    './node_modules/dj-library/**/*.js'
  ],
  // Config will override the default config
  'config': {
    'closure_entry_point': 'application.bootstrap',
    'externs': []
  }
});
```
### Default config
```javascript
{
  'generate_exports': '1',
  'only_closure_dependencies': '1',
  'compilation_level': 'ADVANCED',
  'warning_level': 'VERBOSE',
  'output_wrapper': '(function(){\n%output%\n})()'
}
```