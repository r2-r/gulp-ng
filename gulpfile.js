var gulp = require('gulp');
var loadPlugins = require('gulp-load-plugins');

var $ = loadPlugins();

gulp.task('serve', function () {
	var server = $.liveServer.static('app', 8080);
	server.start();

	gulp.watch(['app/**/*.css', 'app/**/*.html', 'app/**/*.js'], function (event) {
		log('File: ' + event.path + ' has been changed. Reloading...');
		server.notify.apply(server, [event]);
	});
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