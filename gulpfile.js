const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const concat = require('gulp-concat');

sass.compiler = require('node-sass');

/* 
  GULP'S TOP LEVEL FUNCTIONS:
  - gulp.task → Define task.
  - gulp.src → Pointing at the files to use.
  - gulp.dest → The output path for the task.
  - gulp.watch → Watch files or folders for changes.
*/

// Logs out a message.

gulp.task('message', done => {
  console.log('Gulp is running...');
  done();
});

// Copy all HTML.
gulp.task('copyHTML', () => {
  // return gulp.src('./src/*.html').pipe(gulp.dest('./dist'));
  return gulp.src('./src/*.html').pipe(gulp.dest('./dist'));
});

// ======================================================================================================== //

// Minify images. There are more options in its docs to customize the uptimization.

gulp.task('imageMin', () => {
  return gulp
    .src('./src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/images'));
});

// ======================================================================================================== //

// Minify a JavaScript file. It's only available for ES5 syntax.

gulp.task('compress', () => {
  return gulp
    .src('./src/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

// ======================================================================================================== //

// Compile SASS to regular CSS.

function compileSass() {
  return gulp
    .src('./src/scss/**/*.scss')
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'));
}

gulp.task('sass', () => {
  return gulp
    .src('./src/scss/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('sass:watch', () => {
  gulp.watch('./src/scss/**/*.scss', gulp.series(compileSass));
});

// ======================================================================================================== //

// Concatenate JavaScript files.

gulp.task('joinScripts', () => {
  return gulp
    .src('./src/js/*.js')
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

// ======================================================================================================== //

// Watch files all at once. Each task will get called if a change occur to its respective file/directory.

gulp.task('watch', () => {
  gulp.watch('./src/*.html', gulp.series('copyHTML'));
  gulp.watch('./src/scss/**/*.scss', gulp.series(compileSass));
  gulp.watch('./src/js/*.js', gulp.series('joinScripts'));
  gulp.watch('./src/images/*', gulp.series('imageMin'));
});

// ======================================================================================================== //

// Default task will be called when we execute the command 'gulp' without specifying any task.
// It's good to put default task at the lowermost part of the code.
gulp.task(
  'default',
  gulp.parallel('copyHTML', 'sass', 'imageMin', 'joinScripts')
);
