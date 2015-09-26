var gulp = require('gulp');
var loadPlugins = require('gulp-load-plugins');

var config = require('./gulp.config')();

var $ = loadPlugins();


gulp.task('serve', function () {
	var server = $.liveServer.static(config.client, config.serverPort);
	server.start();

	gulp.watch(config.files, function (event) {
		log('File: ' + event.path + ' has been changed. Reloading...');
		server.notify.apply(server, [event]);
	});
});

gulp.task('wiredep', function () {
	var wiredep = require('wiredep').stream;
	var options = config.getWireDepOptions();
	
	return gulp
		.src(config.index)
		.pipe(wiredep(options))
		.pipe($.inject(gulp.src(config.js)))
		.pipe(gulp.dest(config.client));
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