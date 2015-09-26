var gulp = require('gulp');
var loadPlugins = require('gulp-load-plugins');

var $ = loadPlugins();

gulp.task('serve', function() {
	var server = $.liveServer.static('app', 8080);
	server.start();
});