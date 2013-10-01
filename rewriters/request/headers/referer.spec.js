var UrlHelper = require('../../../context/url-convertor');
var FakeRequest = require('../../../test/fake-request');
var headerRewriter = require('./referer');
var assert = require('assert');


describe('referer request header', function(){
	it('should convert to the target referer', function(){
		var toProxyUrlFn = new UrlHelper(new FakeRequest({url: 'http://www.google.com'})).toProxyUrl;
		var url = 'http://www.github.com?search=what';

		var targetReferer = headerRewriter(toProxyUrlFn(url), toProxyUrlFn);
		assert.equal(targetReferer, url);
	});
});
