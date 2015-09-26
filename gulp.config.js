module.exports = function() {
	var client = 'app/';
	
	var config = {
		client: client,
		release: 'release/',
		serverPort: 8080,
		files: [
			client + '**/*.css',
			client + '**/*.html',
			client + '**/*.js'],
		index: client + 'index.html',
		js: [
			client + '**/*.module.js',
			client + '**/*.js'
		],
		ts: [
			'typings/**/*.d.ts',
			client + '**/*.module.ts',
		],
		bower: {
			json: require('./bower.json'),
			directory: './bower_components/',
			ignorePath: '../..'
		}
	};
	
	config.getWireDepOptions = function() {
		return {
			bowerJson: config.bower.json,
			directory: config.bower.directory,
			ignorePath: config.bower.ignorePath
		};
	}
	
	return config;
};