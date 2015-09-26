module.exports = function() {
	var client = 'app/';
	
	var config = {
		client: client,
		serverPort: 8080,
		files: ['app/**/*.css', 'app/**/*.html', 'app/**/*.js'],
		index: client + 'index.html',
		js: [
			client + '**/*.module.js',
			client + '**/*.js'
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