
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , proxy = require('./proxy')
  , http = require('http')
  , path = require('path')
  , settings = require('./settings')()
;

var app = express();

// all environments
app.set('port', process.env.PORT || settings.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'hjs');


app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use('/templates.js', require('connect-handlebars')( __dirname + '/public/templates', { ext: ['handlebars'] }))
app.use(app.router);

app.locals({
    LastCommit: process.env.MT3_lastCommit || '2dd0af47bc8586681b48733ec8f27413d0489e6a'
});


// development only
if ('development' == app.get('NODE_ENV')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/*', proxy.go);



app.use(function(err, req, res, next){
    console.error(err.stack);
    res.send(500, 'Something broke!');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



exports.settings = settings;