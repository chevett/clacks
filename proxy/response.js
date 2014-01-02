var util = require("util"),
	concatStream = require('concat-stream'),
	PassThrough = require('stream').PassThrough;


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

function _doBodyWrite(self, context, innerResponse){
	var contentType = _getContentType(innerResponse),
		bodyRewriter = context.convert.rewriters.response[contentType],
		encoding = _getEncoding(innerResponse);


	// something like an image just gets piped without making any changes
	if (!bodyRewriter){
		innerResponse.pipe(self);
		return this;
	}

	// but for something like html, will build up the body, change the body, then write
	var bodyBuilder = concatStream(function(body){
		body = new Buffer(body || '', encoding).toString(encoding);

		body = bodyRewriter(body, context);

		self.write(body, encoding);
		self.end();
	});

	innerResponse.pipe(bodyBuilder);
}

function TranslatedResponse(context, innerResponse){
	PassThrough.call(this);

	var _self = this;

	process.nextTick(function(){
		context.convert.rewriters.response.headers.convert(innerResponse.headers, context, function(newHeaders){
			_self.emit('headers', innerResponse.statusCode, newHeaders);
			_doBodyWrite(_self, context, innerResponse);
		});
	});
}

util.inherits(TranslatedResponse, PassThrough);
module.exports = TranslatedResponse;
