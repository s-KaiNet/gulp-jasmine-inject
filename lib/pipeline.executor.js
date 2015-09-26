var utils = require("./utils.js");

function PipelineExecutor(page, log, waitForExternalCallback){
	var self = this;
	this._pipeline = [];
	this._step = 0;
	this._page = page;
	this._loadInProgress;
	this._logger = log;
	this._waitForExternalOperation = waitForExternalCallback || function() {return true;};
	
	this._page.onLoadStarted = function() {
		self._loadInProgress = true;
	};
	
	this._page.onLoadFinished = function() {
		self._loadInProgress = false;
	};
}

PipelineExecutor.prototype.push = function(name, callback){
	this._pipeline.push({name: name, callback: callback});
}

PipelineExecutor.prototype.execute = function(onReadyCallback){
	var self = this;
	utils.waitfor(function(){
		if (!self._loadInProgress && !self._waitForExternalOperation() && typeof self._pipeline[self._step] !== "undefined") {
			self._logger.log("Step: " + self._pipeline[self._step].name);
			self._pipeline[self._step].callback();
			self._step++;
		}
		if (typeof self._pipeline[self._step] === "undefined") {
			self._logger.log("Pipeline complete");
			return true;
		}
		
		return false;
	}, onReadyCallback, function(){}, -1);
}

module.exports = {
	PipelineExecutor: PipelineExecutor
}