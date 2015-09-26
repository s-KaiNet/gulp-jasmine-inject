function Logger(verbose){
	var self = this;
	this._verbose = verbose;
	this.log = function(message){
		if(self._verbose){
			console.log(message);
		}
	}
}

module.exports = {
	Logger: Logger
};