Contains sample injecting jasmine along with custom script into the SharePoint and extracting test results. 

Using: 
----
Get jasmineInject:   

`var jasmineInject = require("gulp-jasmine-inject");`  

Run task:

```javascript
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
```  

Parameters: 
---
- `siteUrl` - required, string url of the site (SharePoint Online or on-premise)
- `username` - required, string user name
- `password` - required, string password
- `phantomInitCallbacks` - optional, this callbacks will be called right after `siteUrl` will be opened. Order is the same as in declarations. In this sample `sharepoint.callback.js` used to authenticate user in browser. Callbacks accept PhantomJS's page object, options which you are passed into the `jasmineInject` and `next` callback indicating that current function finished execution
- `additionalJS` - optional, javascript files, which will be included into the page. This can be your library under test
- `verbose` - show additional output in console  

For even more detailed real world sample refer to [SPListRepostiory.js](https://github.com/s-KaiNet/SPListRepository.js) project and explore `gulpfile.js` (`tests` task) along with spec file.