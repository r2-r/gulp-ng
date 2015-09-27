var gulp = require('gulp');

var loadPlugins = require('gulp-load-plugins');

var config = require('./gulp.config')();

var $ = loadPlugins();

gulp.task('serve', ['build'], function () {
	log('Starting live server... [release]');

	var server = $.liveServer.static(config.release, config.serverPort);
	server.start();
});

gulp.task('serve-dev', ['compile'], function () {
	log('Starting live server... [dev]');

	var server = $.liveServer.static(config.root, config.serverPort);
	server.start();

	gulp.watch(config.files, function (event) {
		log('File: ' + event.path + ' has been changed. Reloading...');
		server.notify.apply(server, [event]);
	});

	gulp.watch(config.ts, ['compile']);
});

gulp.task('inject', ['compile', 'cache-templates', 'sass'], function () {
	log('Injecting dependencies...');

	var wiredep = require('wiredep').stream;
	var options = config.getWireDepOptions();

	return gulp
		.src(config.index)
		.pipe($.plumber())
		.pipe(wiredep(options))
		.pipe($.inject(gulp.src(config.js), { relative: true }))
		.pipe($.inject(gulp.src(config.css), { relative: true }))
		.pipe(gulp.dest(config.client));
});

gulp.task('cache-templates', ['clean-scripts'], function () {
	log('Creating template cache...');

	return gulp
		.src(config.templates)
		.pipe($.plumber())
		.pipe($.minifyHtml({ empty: true }))
		.pipe($.angularTemplatecache(config.templateCache.file, config.templateCache.options))
		.pipe(gulp.dest(config.scripts))
});

gulp.task('optimize', ['inject'], function () {
	log('Optimzing files...');

	var assets = $.useref.assets({ searchPath: config.client });

	return gulp
		.src(config.index)
		.pipe($.plumber())
		.pipe(assets)
		.pipe($.if('*.js', $.ngAnnotate()))
		.pipe($.if('*.js', $.uglify()))
		.pipe($.if('*.css', $.autoprefixer({ browsers: ['> 5%'], cascade: false })))
		.pipe($.if('*.css', $.minifyCss()))
		.pipe(assets.restore())
		.pipe($.useref())
		.pipe(gulp.dest(config.release));
});

gulp.task('build', ['clean', 'optimize']);

gulp.task('compile', ['clean-scripts'], function () {
	log('Compiling typescript files...');

	var tsResult = gulp
		.src(config.ts)
		.pipe($.plumber())
		.pipe($.typescript({
			target: "ES5",
			module: "amd",
			sourceMap: true,
			rootDir: config.client,
			out: config.compiledTs
		}));
	return tsResult.js.pipe(gulp.dest(config.client))
});

gulp.task('sass', ['clean-css'], function () {
	return gulp
		.src(config.scss)
		.pipe($.plumber())
		.pipe($.sass().on('error', $.sass.logError))
		.pipe(gulp.dest(config.styles));
});

gulp.task('clean', ['clean-release', 'clean-scripts', 'clean-css']);

gulp.task('clean-release', function (done) {
	return gulp
		.src(config.release + '**/*', { read: false })
		.pipe($.rm());
});

gulp.task('clean-scripts', function (done) {
	return gulp
		.src(config.scripts + '*.js', { read: false })
		.pipe($.rm());
});

gulp.task('clean-css', function (done) {
	return gulp
		.src(config.css, { read: false })
		.pipe($.rm());
});

function log(msg) {
	if (typeof (msg) === 'object') {
		for (var item in msg) {
			if (msg.hasOwnProperty(item)) {
				$.util.log($.util.colors.blue(item + ': ' + msg[item]));
			}
		}
	} else {
		$.util.log($.util.colors.blue(msg));
	}
}