var Context = require('../../../context/');
var testHelper = require('../../../test/helper');
var headerRewriter = require('./location');
var assert = require('assert');

describe('location request header', function(){
	it('should convert to the proxied location', function  (){
		var context = new Context(testHelper.createRequest('http://www.google.com'));
		var url = 'http://www.github.com/chevett';
		var proxiedLocation = headerRewriter(url, context);
		
		assert.equal(proxiedLocation, context.convert.toProxyUrl(url));
	});
});
