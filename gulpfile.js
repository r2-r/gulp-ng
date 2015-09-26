var gulp = require('gulp');
var del = require('del');
var loadPlugins = require('gulp-load-plugins');

var config = require('./gulp.config')();

var $ = loadPlugins();


gulp.task('serve', function () {
	log('Starting live server...');
	
	var server = $.liveServer.static(config.client, config.serverPort);
	server.start();

	gulp.watch(config.files, function (event) {
		log('File: ' + event.path + ' has been changed. Reloading...');
		server.notify.apply(server, [event]);
	});
});

gulp.task('wiredep', function () {
	log('Injecting dependencies...');
	
	var wiredep = require('wiredep').stream;
	var options = config.getWireDepOptions();

	return gulp
		.src(config.index)
		.pipe(wiredep(options))
		.pipe($.inject(gulp.src(config.js)))
		.pipe(gulp.dest(config.client));
});

gulp.task('build', [ 'clean', 'compile' ], function(){
	log('Building release...');
	
	return gulp
			.src(config.files)
			.pipe(gulp.dest(config.release));
});

gulp.task('compile', function () {
	log('Compiling typescript files...');
	
	var tsResult = gulp
					.src(config.ts)
					.pipe($.typescript({
						rootDir: 'app/',
						out: 'app.js'
					}));
	return tsResult.js.pipe(gulp.dest(config.release))
});

gulp.task('clean', function(done) {
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