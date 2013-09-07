var connect = require('connect'),
  proxy = require('./proxy'),
  http = require('http'),
  https = require('https'),
  fs = require('fs'),
  path = require('path'),
  settings = require('./settings')(),
  context = require('./context'),
  sslOptions
;

var app = connect();
var port = process.env.PORT || settings.port;

// middleware
app.use(connect.favicon());
app.use(connect.logger('dev'));
app.use(require('less-middleware')({ src: __dirname + '/injectors/public' }));
app.use(connect.static(path.join(__dirname, '/injectors/public')));
app.use(proxy.go);
app.use(function(err, req, res, next){
    console.log('mt3 global error handler: ');
    console.log(err);
    res.end();
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






