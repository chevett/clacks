var util = require("util"),
	concatStream = require('concat-stream'),
	PassThrough = require('stream').PassThrough,
	rewriters = require('./rewriters/').response,
	injectors =  require('./injectors/')
;


function _getContentType(innerResponse){
	var contentType = (innerResponse.headers['content-type'] || '').match(/^([\w\-/]+?)(;|$)+/i);
	return contentType && contentType.length>1 ? contentType[1] : null;
}

// can i get the encoding from nodejs?  like how does concat-stream know the encoding?  i don't get it
function _getEncoding(innerResponse){
	var matches = (innerResponse.headers["content-type"] || '').match(/charset=(.+)/i),
		encoding =   matches && matches.length>1 ? (matches[1] || '').toLowerCase() : 'utf-8';

	switch (encoding){
		case 'iso-8859-1':
			return 'utf-8';

		default:
			return encoding;
	}
}

function TranslatedResponse(context, innerResponse){
	PassThrough.call(this);

	var _self = this,
		contentType = _getContentType(innerResponse),
		bodyRewriter = rewriters[contentType],
		encoding = _getEncoding(innerResponse);

	process.nextTick(function(){
		var newHeaders = rewriters.headers(innerResponse.headers, context);
		_self.emit('headers', innerResponse.statusCode, newHeaders);
	});

	// something like an image just gets piped without making any changes
	if (!bodyRewriter){
		innerResponse.pipe(this);
		return this;
	}

	// but for something like html, will build up the body, change the body, then write
	var bodyBuilder = concatStream(function(body){
		body = new Buffer(body || '', encoding).toString(encoding);
		body = bodyRewriter(body, context);

		var model =  {
			contentType: contentType,
			body: body
		};
		
		_self.emit('before-write', model);

		_self.write(model.body, encoding);
		_self.end();
	});

	innerResponse.pipe(bodyBuilder);
}



util.inherits(TranslatedResponse, PassThrough);
module.exports = TranslatedResponse;
