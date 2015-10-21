var utils = (function() {    
    return {
        waitfor: function(check, onTestPass, onTimeout, timeout, freqMs) {
            var timeoutMs;
            if(timeout && timeout === -1){
                timeoutMs = 2147483647;
            } else{
                timeoutMs = timeout || 3000; //< Default timeout is 3s
            }
            var freqMs = freqMs || 250,             //< Default Freq is 250ms
                start = Date.now(),
                condition = false,
                timer = setTimeout(function() {
                    var elapsedMs = Date.now() - start;
                    if ((elapsedMs < timeoutMs) && !condition) {
                        // If not time-out yet and condition not yet fulfilled
                        condition = check(elapsedMs);
                        timer = setTimeout(arguments.callee, freqMs);
                    } else {
                        clearTimeout(timer); //< house keeping
                        if (!condition) {
                            // If condition still not fulfilled (timeout but condition is 'false')
                            onTimeout(elapsedMs);
                        } else {
                            // Condition fulfilled (timeout and/or condition is 'true')
                            onTestPass(elapsedMs);
                        }
                    }
                }, freqMs);
        },
        joinPath: function() {
            var args = Array.prototype.slice.call(arguments);
            return args.join('/');
        }
    }
})();

module.exports = utils;