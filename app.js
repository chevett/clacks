
var express = require('express'),
  routes = require('./routes'),
  proxy = require('./proxy'),
  http = require('http'),
  https = require('https'),
  fs = require('fs'),
  path = require('path'),
  settings = require('./settings')(),
  sslOptions /*= {
      key: fs.readFileSync('local.pem'),
      cert: fs.readFileSync('local-cert.pem')
  }*/
;

var app = express();


// settings
app.set('port', settings.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'hjs');


// middleware
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.send(500, 'Something broke!');
});


// routing
app.get('/', routes.home);
app.get('/scripts/handlebars.js', routes.handlebars);
app.get('/scripts/templates.js', routes.templates);
app.get('/*', proxy.go);
app.post('/*', proxy.go);


// start
http.createServer(app).listen(settings.port, function(){
    console.log('Express server listening on port ' + settings.port);
});

/*if (sslOptions.key && sslOptions.cert){
    https.createServer(sslOptions, app).listen(settings.sslPort, function(){
        console.log('Express server listening on port ' + settings.sslPort);
    });
}*/


