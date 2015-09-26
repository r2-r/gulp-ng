var liveServer = require("live-server");
 
var params = {
    port: 8080,
    host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0. 
    root: "./app", // Set root directory that's being server. Defaults to cwd.
    open: false, 
    ignore: '.vscode,bower_components,node_modules,test', // comma-separated string for paths to ignore 
    file: "index.html", // When set, serve this file for every 404 (useful for single-page applications) 
    wait: 1000 // Waits for all changes, before reloading. Defaults to 0 sec. 
};
liveServer.start(params);