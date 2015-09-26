var phantom = phantom || {},
	system = require('system'),
	urlparse = require('url').parse,
	page = require('webpage').create(),
	fs = require("fs"),
	utils = require("./utils.js"),
	logModule = require("./logger.js"),
	pipelineExecutorModule = require("./pipeline.executor.js"),
	loadInProgress = false, 
	testindex = 0,
	customCallback,
	waitForExternalExecution = false,
	i,
	jasmineCoreRoot = "./../node_modules/jasmine-core/lib/jasmine-core",
	jasmineReportersRoot = "./../node_modules/jasmine-reporters/src",
	jasmineSources = [jasmineCoreRoot + "/jasmine.js", 
						jasmineCoreRoot + "/jasmine-html.js",
						"boot.js",
						jasmineReportersRoot + "/tap_reporter.js",
						jasmineReportersRoot + "/nunit_reporter.js"],
	suitesResults;

var options = JSON.parse(system.args[1]);
var logger = new logModule.Logger(options.verbose);
var pipelineExecutor = new pipelineExecutorModule.PipelineExecutor(page, logger, function(){
	return waitForExternalExecution;
})


page.onConsoleMessage = function(msg, lineNum, sourceId) {
	console.log('WEB console: ' + msg);
};

page.viewportSize = {
  width: 1600,
  height: 900
};

pipelineExecutor.push("Opening url " + options.siteUrl, function(){
	page.open(options.siteUrl);
});

if(options.phantomInitCallbacks){	
	for(i = 0; i < options.phantomInitCallbacks.length; i++){
		(function(i){
			var customCallback = require(options.phantomInitCallbacks[i]);		
			pipelineExecutor.push("Executing custom callback " + i, function(){
				waitForExternalExecution = true;
				customCallback(page, options, function(){
					waitForExternalExecution = false;
				});
			});
		})(i);		
	}	
}

if(options.additionalJS){
	pipelineExecutor.push("Injecting additional JavaScript files", function(){
		for (i = 0; i < options.additionalJS.length; i++) {
			if(!page.injectJs(options.additionalJS[i])){
				logger.log("Unable to inject script " + options.additionalJS[i]);
				logger.log("Stopping...");
				phantom.exit();
			}
		}
	});
}

pipelineExecutor.push("Injecting jasmine sources", function(){
	page.evaluate(function(){
		window.__phantom_writeFile = function(fileName, xmlText){
			window.jasmineDone = true;
			window.jasmineResults = xmlText;
		}
	});
	for (i = 0; i < jasmineSources.length; i++) {
		if(!page.injectJs(jasmineSources[i])){
			logger.log("Unable to inject jasmine script " + jasmineSources[i]);
			logger.log("Stopping...");
			phantom.exit();
		}
	}
	page.evaluate(function(){
		window.jasmine.getEnv().addReporter(new window.jasmineReporters.TapReporter());
		window.jasmine.getEnv().addReporter(new window.jasmineReporters.NUnitXmlReporter());
	});
});

pipelineExecutor.push("Injecting spec script", function(){
	if(!page.injectJs(options.specPath)){
		logger.log("Unable to inject spec script " + options.specPath);
		logger.log("Stopping...");
		phantom.exit();
	}
});

pipelineExecutor.push("Running jasmine", function(){
	page.evaluate(function(){
		window.jasmine.getEnv().execute();
	});
});

pipelineExecutor.push("Waiting for jasmine to finish", function(){
	waitForExternalExecution = true;
	utils.waitfor(function() {
		return page.evaluate(function() {
				return !!(window.jasmineDone);
			});
		}, function(){			
			suitesResults = page.evaluate(function(){
				return window.jasmineResults;
			});
			waitForExternalExecution = false;
		}, function(){
			logger.log("Jasmine timed out. Stopping...");
			waitForExternalExecution = false;
		});
});

pipelineExecutor.push("Finishing", function(){
	fs.write(options.resultsFileName, suitesResults, 'w');
	logger.log("Test complete");
});

pipelineExecutor.execute(function(){
	phantom.exit();
});