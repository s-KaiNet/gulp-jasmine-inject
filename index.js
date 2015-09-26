var phantomjs = require('phantomjs'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError,
    path = require("path"),
	through = require("through2"),
	binPath = phantomjs.path, 
	childProcess = require('child_process'),
	fs = require("fs"),
	uuid = require('uuid');

var PLUGIN_NAME = 'gulp-jasmine-inject';

function gulpJasmineInject(options) {
	if (!options) {
		throw new PluginError(PLUGIN_NAME, 'Missing options');
	}

	return through.obj(function (file, enc, cb) {
		var self = this;

		if (file.isNull()) {
			cb();
			return;
		}

		if (file.isStream()) {
			this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
			cb();
			return;
		}

		if (file.isBuffer()) {
			options.specPath = file.path;
			options.resultsFileName = uuid.v1() + ".xml";
			var childArgs = [path.join(__dirname, "./lib/phantom.runner.js"),
							JSON.stringify(options)];

			var child = childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
				if(err){
					self.emit('error', new PluginError(PLUGIN_NAME, err));
					cb();
					return;
				}
				if(stderr){
					self.emit('error', new PluginError(PLUGIN_NAME, stderr));
					cb();
					return;
				}
				fs.readFile(options.resultsFileName, function(err, data){
					if(err){
						self.emit('error', new PluginError(PLUGIN_NAME, err));
						cb(new PluginError(PLUGIN_NAME, err));
						return;
					}
					
					var parsedPath = parsePath(file.path);
					var dateNow = new Date();
					var time = dateNow.toLocaleTimeString().replace(/:/g, "-");
					var date = dateNow.toLocaleDateString().replace(/\//g, " ");
					var datePart = date + " " + time; 
					file.contents = new Buffer(data);
					file.path = path.join(parsedPath.dirname, datePart + " " + parsedPath.basename + parsedPath.extname + ".xml");
					
					fs.unlink(options.resultsFileName, function(){
						if(err){
							self.emit('error', new PluginError(PLUGIN_NAME, err));
							cb(new PluginError(PLUGIN_NAME, err));
							return;
						}
						cb(null, file);	
					})		
									
				});
			});

			child.stdout.on('data',
				function(chunk){
					console.log(chunk);
				}
			);    
			
			child.stderr.on('data',
				function(chunk){
					console.log("ERROR:" + chunk);
				}
			);
		}
	});	
}

function parsePath(filePath) {
	var extname = path.extname(filePath);
	return {
		dirname: path.dirname(filePath),
		basename: path.basename(filePath, extname),
		extname: extname
	};
}

module.exports = gulpJasmineInject;