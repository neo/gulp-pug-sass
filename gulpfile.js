const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
// const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const inquirer = require('inquirer');

const watch_path = 'tmp';
let indentedSyntax;

gulp.task('pug', () =>
  gulp.src('src/*.pug')
    .pipe(pug({ pretty: true }).on('error', (error) => { console.error(error.message); }))
    .pipe(gulp.dest(watch_path))
    .pipe(browserSync.stream())
);

gulp.task('sass', () => {
  if (indentedSyntax === undefined) {
    return inquirer.prompt([{
      type: 'list',
      name: 'indentedSyntax',
      message: 'Which Sass syntax do you use?',
      choices: [{
        name: 'SCSS syntax',
        value: false,
      }, {
        name: 'Sass INDENTED syntax',
        value: true,
      }],
      default: 0,
    }]).then((answers) => {
      indentedSyntax = answers.indentedSyntax;
      return gulp.src('src/styles/*.scss')
        .pipe(sass({ indentedSyntax }).on('error', sass.logError))
        .pipe(gulp.dest(watch_path))
        .pipe(browserSync.stream());
    });
  }
  return gulp.src('src/styles/*.scss')
    .pipe(sass({ indentedSyntax }).on('error', sass.logError))
    .pipe(gulp.dest(watch_path))
    .pipe(browserSync.stream());
});

gulp.task('watch', ['pug', 'sass'], () => {
  browserSync.init({
    host: process.env.IP || null,
    port: process.env.PORT || 3000,
    server: watch_path,
  });

  gulp.watch('src/**/*.pug', ['pug']);
  gulp.watch('src/**/*.scss', ['sass']);
});
