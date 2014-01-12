var fileName = '/mt3.js';

module.exports = function($, context){
	var $script = $('<script src="'+fileName+'"></script>');

	$('head').prepend($script);
};

module.exports.middleware = function(){
	// can't write files on heroku...

	var browserify = require('browserify');
	var b = browserify();
	b.transform('sassify2');
	b.transform('vashify');
	if (process.env.NODE_ENV === 'production'){
		b.transform('uglifyify');
	}
	
	var fs = require('fs');
	
	var jsStr;
	var concatStream = require('concat-stream');

	b.add(__dirname+'/client-side/main.js');

	// might be able to serve an empty file while the app is starting up, right?
	b.bundle().pipe(concatStream(function(js){
		jsStr = js;
	}));

	return function(req, res, next){
		if (req.url !== fileName){
			return next();
		}

		res.writeHead(200, {
			'Content-type': 'text/javascript'
		});
		res.write(jsStr);
		res.end();
	};
};
