var Context = require('../../../context/');
var FakeRequest = require('../../../test/fake-request');
var headerRewriter = require('./location');
var assert = require('assert');

describe('location request header', function(){
	it('should convert to the proxied location', function  (done){
		var context = new Context(new FakeRequest({url: 'http://www.google.com'}));
		var url = 'http://www.github.com/chevett';

		headerRewriter(url, context, function(proxiedLocation){
			assert.equal(proxiedLocation, context.convert.toProxyUrl(url));
			done();
		});
		
	});
});
