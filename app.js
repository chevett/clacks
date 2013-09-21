var express = require('express'),
  http = require('http'),
  https = require('https'),
  fs = require('fs'),
  path = require('path'),
  settings = require('./settings')(),
  proxy = require('./proxy'),
  sslOptions
;

bad = notGood
var app = express();
var port = process.env.PORT || settings.port;

// middleware
app.use(express.favicon());
app.use(express.cookieParser(settings.cookieSecret));
app.use(express.logger('dev'));
app.use(require('less-middleware')({ src: __dirname + '/injectors/public' }));
app.use(express.static(path.join(__dirname, '/injectors/public')));
app.use(proxy);

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
