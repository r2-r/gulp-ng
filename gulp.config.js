module.exports = function() {
	var client = 'app/';
	
	var config = {
		root: './',
		client: client,
		release: 'release/',
		scripts: client + 'scripts/',
		serverPort: 8080,
		files: [
			client + '**/*.css',
			client + '**/*.html',
			client + '**/*.js'],
		index: client + 'index.html',
		js: [
			client + '**/*.js'
		],
		css: [
			client + '**/*.css'
		],
		ts: [
			'typings/**/*.d.ts',
			client + '**/*.module.ts',
		],
		templates: [
			client + '**/*.tpl.html'
		],
		compiledTs: 'scripts/main.js',
		bower: {
			json: require('./bower.json'),
			directory: './bower_components/',
			ignorePath: '../..'
		},
		templateCache: {
			file: 'templates.js',
			options: {
				module: 'app',
				standAlone: false
			}
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