var gulp = require('gulp'),
	sass = require('gulp-sass')(require('node-sass')),
	csso = require('gulp-csso'),
	notify = require('gulp-notify'),
	csssvg = require('gulp-css-svg'),
	plumber = require('gulp-plumber'),
	imagemin = require('gulp-imagemin'),
	globalize = require('gulp-sass-glob'),
	sourcemaps = require('gulp-sourcemaps');

var folders = {
	build: './build',
	styles: './styles',
	images: './images',
};

var sources = {
	style: 'styles/style.scss',
	styles: [
		'styles/*.scss',
		'styles/base/*.scss',
		'styles/blocks/*.scss',
		'styles/elements/*.scss',
		'styles/includes/*.scss'
	]
};

var options = {
	plumber: {
		errorHandler: notify.onError({
			message: "<%= error.message %>",
			sound: true
		})
	},
	csso: {
		cascade: false,
	},
	csssvg: {
		baseDir: '../images',
		maxWeightResource: 4096
	},
	sass: {
		outputStyle: 'expanded',
		indentType: 'tab',
		indentWidth: 1
	},
	sourcemaps: {
		styles: {
			includeContent: false,
			sourceRoot: '../styles/'
		},
	},
	browsersync: {
		server: {
			baseDir: './'
		},
		notify: false
	}
};


gulp.task('imagemin', function() {

	return gulp.src(folders.images + '/**/*')
		.pipe(plumber(options.plumber))
		.pipe(imagemin())
		.pipe(gulp.dest(folders.images));

});


gulp.task('styles', function() {

	return gulp.src(sources.style)
		.pipe(plumber(options.plumber))
		.pipe(sourcemaps.init())
		.pipe(globalize())
		.pipe(sass(options.sass))
		.pipe(sourcemaps.write('./', options.sourcemaps.styles))
		.pipe(csssvg(options.csssvg))
		//.pipe(csso(options.csso))
		.pipe(gulp.dest(folders.build));

});

gulp.task('build', function(cb) {
	gulp.parallel('styles')();
	cb();
});

gulp.task('default', function() {
	gulp.watch(sources.styles, gulp.parallel('styles'));
});