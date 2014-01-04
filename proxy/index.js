var Context = require('../context/'),
	TranslatedRequest = require('./request');

module.exports = function(req, res, next){
	var ctx = new Context(req, res);
	var url = req.url.substr(1);

	if (!ctx.target){
		console.log('no target: ' + req.url);
		return next();
	}

	if (url !== ctx.target.url){
		return res.redirect(302, ctx.convert.toProxyUrl(ctx.target.url));
	}

	var request = new TranslatedRequest(ctx, {
		url: ctx.target.url,
		method: req.method,
		headers: req.headers
	});

	req.pipe(request);

	request.on('error', function(e){
		res.writeHead(302,{location: '/500.html?message=' + encodeURIComponent(e.message)} );
		res.end();
	});

	request.on('ready', function(response){
		response.on('headers', function(statusCode, headers){
			res.writeHead(statusCode, headers.toObject());
		});

		response.pipe(res);
	});
};
