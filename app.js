
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , proxy = require('./proxy')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , settings = require('./settings')()
;

var app = express();


// all environments
app.set('port', process.env.PORT);
app.set('views', __dirname + '/views');
app.set('view engine', 'hjs');
app.set('domain', 'localhost');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));


if ('production' == app.get('env')) {
    settings.hostname = 'miketown3.com';
    settings.port = 80;
}

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}



app.get('/', routes.index);
app.get('/*', proxy.go);

app.get('/users', user.list);

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.send(500, 'Something broke!');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



exports.settings = settings;