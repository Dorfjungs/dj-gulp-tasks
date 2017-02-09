# Gulp tasks

Useful tasks with an easy setup.

## sassc

Compile and watch sass files

### Dependencies
#### Npm modules: 
- gulp-rename
- gulp-run

#### Others: 
- LibSass

#### Quick install
##### Npm modules:
````bash
npm install --save-dev gulp-rename gulp-run
````
##### LibSass (homebrew)
````bash
brew install libsass
````
### Usage
This will automaticall create the following tasks:
- sassc -> sassc-watch
- sassc-watch -> sassc-compile
- sassc-compile

````javascript
const sassc = require('./gulp-tasks/sassc.js');

sassc({
	'watch': './styles/scss',
	'files': [
		{
			'entry': './styles/scss/*.scss',
			'output': './styles/css'
		}
	]
});
````
