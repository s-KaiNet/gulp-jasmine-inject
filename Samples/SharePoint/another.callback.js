module.exports = function(page, options, next){
	console.log("intermediate step");
	page.includeJs("https://code.jquery.com/jquery-2.1.4.min.js", function(){
		var rect = page.evaluate(function(){
			var el = window.jQuery("table#onetidDoclibViewTbl0 tbody tr:first td:first");
		   return el[0].getBoundingClientRect();
		});
		page.sendEvent('click', rect.left + rect.width / 2, rect.top + rect.height / 2);
		page.render("screen.png");
		next();
	});
}