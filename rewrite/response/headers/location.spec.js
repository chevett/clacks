var urlHelper = require('../../../url-helper');
var testHelper = require('../../../test/helper');
var headerRewriter = require('./location');
var assert = require('assert');

describe('location request header', function(){
	it('should convert to the proxied location', function  (){
		var toProxyUrlFn = urlHelper.createToProxyUrlFn(testHelper.createRequest('http://www.google.com'));
		var url = 'http://www.github.com/chevett';
		var proxiedLocation = headerRewriter(url, toProxyUrlFn);
		
		assert.equal(proxiedLocation, toProxyUrlFn(url));
	});
});
