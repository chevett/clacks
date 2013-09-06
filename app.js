var express = require('express'),
  proxy = require('./proxy'),
  http = require('http'),
  https = require('https'),
  fs = require('fs'),
  path = require('path'),
  settings = require('./settings')(),
  context = require('./context'),
  sslOptions
;

var app = express();
var port = process.env.PORT || settings.port;

// middleware
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(require('less-middleware')({ src: __dirname + '/injectors/public' }));
app.use(express.static(path.join(__dirname, '/injectors/public')));
app.use(app.router);
app.use(function(err, req, res, next){
    console.log('mt3 global error handler: ');
    console.log(err);
    res.end();
});


// routing
app.get('/*', proxy.go);
app.post('/*', proxy.go);


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






