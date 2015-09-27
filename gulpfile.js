var gulp = require('gulp');
var del = require('del');

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

gulp.task('inject', function () {
	log('Injecting dependencies...');

	var wiredep = require('wiredep').stream;
	var options = config.getWireDepOptions();

	return gulp
		.src(config.index)
		.pipe(wiredep(options))
		.pipe($.inject(gulp.src(config.js), { relative: true }))
		.pipe($.inject(gulp.src(config.css), { relative: true }))
		.pipe(gulp.dest(config.client));
});

gulp.task('optimize', ['inject'], function () {
	log('Optimzing files...');

	var assets = $.useref.assets({ searchPath: config.client });

	return gulp
		.src(config.index)
	//TODO: template cache
		.pipe($.plumber())
		.pipe(assets)
		.pipe($.if('*.js', $.ngAnnotate()))
		.pipe($.if('*.js', $.uglify()))
		.pipe($.if('*.css', $.minifyCss()))
		.pipe(assets.restore())
		.pipe($.useref())
		.pipe(gulp.dest(config.release));
});

gulp.task('build', ['clean', 'compile', 'optimize'], function () {
	log('Building release...');

	return gulp
	 	.src(config.templates)
	 	.pipe(gulp.dest(config.release));
});

gulp.task('compile', ['inject'], function () {
	log('Compiling typescript files...');

	var tsResult = gulp
		.src(config.ts)
		.pipe($.typescript({
			target: "ES5",
			module: "amd",
			sourceMap: true,
			rootDir: config.client,
			out: config.compiledTs
		}));
	return tsResult.js.pipe(gulp.dest(config.client))
});

gulp.task('clean', function (done) {
	log('Cleaning release files...');

	clean(config.release + '**/*', done);
});

function clean(path, done) {
	log('Cleaning: ' + path);

	del(path).then(function () {
		done();
	});
};

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