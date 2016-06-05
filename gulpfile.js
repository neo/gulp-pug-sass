var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();

gulp.task('styles', function() {
	return gulp.src('src/styles/*.scss')
		.pipe($.sass().on('error', $.sass.logError))
		.pipe($.sourcemaps.init())
		.pipe($.postcss([autoprefixer()]))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest('./src'))
		.pipe(browserSync.stream());
});

gulp.task('default', ['styles'], function() {
	browserSync.init({
		server: './src'
	});
	gulp.watch('src/styles/*.scss', ['styles']);
	gulp.watch('src/*.html').on('change', browserSync.reload);
});
