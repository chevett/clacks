var injectors =  require('../injectors/'),
	Context = require('../context/'),
	TranslatedRequest = require('./request');

module.exports = function(req, res){
	var headersModel = {};
	var ctx = new Context(req, res);

	if (!ctx.target){
		res.writeHead(400, {});
		res.write('<h1>400</h1>');
		res.write(req.url.substr(1) + ' is a bad request');
		res.end();
		return;
	}

	var request = new TranslatedRequest(ctx, {
		url: ctx.target.url,
		method: req.method,
		headers: req.headers
	});

	request.on('headers', function(headers){
		headersModel.request = headers;
	});

	req.pipe(request);

	request.on('ready', function(response){
		response.on('headers', function(statusCode, headers){
			res.writeHead(statusCode, headers.toObject());
			console.log('response headers:');
			console.log(headers.toObject());
			headersModel.response = headers;

		});

		response.on('before-write', function(data){
			if (data.contentType==='text/html'){
				data.body = injectors(ctx, {body: data.body, headers: headersModel});
				console.log('send rewritten response body');
				console.log(data.body.substr(100));
			}
		});

		response.pipe(res);
	});
};
