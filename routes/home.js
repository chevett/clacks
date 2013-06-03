var settings = require('./../settings')()
;


module.exports = function(req, res){
    res.render('index', { title: 'Express', LastCommit:settings.lastCommit });
};