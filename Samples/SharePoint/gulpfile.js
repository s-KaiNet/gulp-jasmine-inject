var gulp = require("gulp"),
	path = require("path"),
	util = require("util"),
	jasmineInject = require("./../../index.js");

gulp.task("jasmine", function(){
	return gulp.src("Spec.js")
	.pipe(jasmineInject({
		siteUrl: "https://[your domain].sharepoint.com/sites/dev/Lists/AppPackages/Forms/AllItems.aspx",
		username: "[username]",
		password: "[password]",
		phantomInitCallbacks: [path.resolve("./sharepoint.callback.js"), path.resolve("./another.callback.js")],
		additionalJS: ["./custom.js"],
		verbose: true
	}))
	.pipe(gulp.dest("./TestResults"));
});