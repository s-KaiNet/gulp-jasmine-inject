function Logger(verbose){
	var self = this;
	this._verbose = verbose;
	this.log = function(message, force){
		if(self._verbose || force){
			console.log(message);
		}
	}
}

module.exports = {
	Logger: Logger
};