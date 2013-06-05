
var express = require('express')
  , routes = require('./routes')
  , proxy = require('./proxy')
  , http = require('http')
  , path = require('path')
  , settings = require('./settings')()
;

var app = express();


// settings
app.set('port', process.env.PORT || settings.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'hjs');


// middleware
app.use(express.favicon());
app.use(express.logger('dev'));
//app.use(express.bodyParser());
//app.use(express.methodOverride());
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));


/*app.use(function(req, res, next){
    // just hack in some middleware to grab the request body.  i think proxy.js should be middleware itself.

    var buf = '';

    req.mt3 = req.mt3 || {};


    req.on('data', function(chunk){
        buf += chunk
        console.log('data received: ' +chunk)

    });

    req.on('end', function(){

        console.log('end: ')

        req.mt3.body = buf;
    });

    console.log('mt3 body grabber calling next');

    // this feels wrong
    next();

});*/

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
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});