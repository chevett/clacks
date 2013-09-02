var urlHelper = require('../../../context/url-convertor');
var testHelper = require('../../../test/helper');
var headerRewriter = require('./referer');
var assert = require('assert');


describe('referer request header', function(){
	it('should convert to the target referer', function  (){
		var toProxyUrlFn = urlHelper.createToProxyUrlFn(testHelper.createRequest('http://www.google.com'));
		var url = 'http://www.github.com?search=what';
		var targetReferer = headerRewriter(toProxyUrlFn(url), toProxyUrlFn);
		
		assert.equal(targetReferer, url);
	});
});
