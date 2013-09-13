var express = require('express'),
  http = require('http'),
  https = require('https'),
  Context = require('./context/'),
  TranslatedRequest = require('./translated-request'),
  fs = require('fs'),
  path = require('path'),
  settings = require('./settings')(),
  injectors =  require('./injectors/'),
  sslOptions
;

var app = express();
var port = process.env.PORT || settings.port;

// middleware
app.use(express.favicon());
app.use(express.cookieParser(settings.cookieSecret));
app.use(express.logger('dev'));
app.use(require('less-middleware')({ src: __dirname + '/injectors/public' }));
app.use(express.static(path.join(__dirname, '/injectors/public')));
app.use(function(req, res){
	var headers = {};
	var ctx = new Context(req, res);

    var request = new TranslatedRequest(ctx, {
		url: ctx.target.url,
		method: req.method,
		headers: req.headers
	});

	request.on('headers', function(statusCode, headers){
		headers.request = headers;
	});

	req.pipe(request);

	request.on('ready', function(response){
		response.on('headers', function(statusCode, headers){
			res.writeHead(statusCode, headers.toObject());
			headers.response = headers;
		});

		response.on('before-write', function(data){
			if (data.contentType==='text/html'){
				data.body = injectors(ctx, {body: data.body, headers: headers});
			}
		});

		response.pipe(res);
	});
});

// start
http.createServer(app).listen(port, function(){
    console.log('listening on port ' + port);
});

if (!settings.isProduction) {
    sslOptions = {
        key: fs.readFileSync('local_ssl/local.pem'),
        cert: fs.readFileSync('local_ssl/local-cert.pem')
    };

    https.createServer(sslOptions, app).listen(settings.sslPort, function(){
        console.log('listening on port ' + settings.sslPort);
    });
}
