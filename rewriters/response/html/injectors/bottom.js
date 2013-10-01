var fileName = '/mt3.js';

module.exports = function($, context){
	var $script = $('<script src="'+fileName+'"></script>');

	$('body').append($script);
};

module.exports.middleware = function(){

	var browserify = require('browserify');
	var b = browserify();
	b.transform('sassify2');
	b.transform('hbsfy');
	var fs = require('fs');
	
	var jsStr;
	var concatStream = require('concat-stream');

	var dirName = __dirname+'/client-side/js';
	fs.readdirSync(dirName).forEach(function(file) {
		if (/\.js$/i.test(file) && file!='index.js' && !/\.spec\.js$/i.test(file)) {
			console.log('bundling: ' + file);
			b.add(dirName + '/'+file);
		}
	});

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
