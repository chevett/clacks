var fs = require('fs')
    ;

module.exports = function(req, res){
    fs.readFile('node_modules/connect-handlebars/node_modules/handlebars/dist/handlebars.runtime.min.js', function(err, data) {
        res.set('Content-Type', 'text/html');
        res.send(200, data);
    });
};
