var urlHelper = require('../../../context/url-convertor');
var FakeRequest = require('../../../test/fake-request');
var headerRewriter = require('./referer');
var assert = require('assert');


describe('referer request header', function(){
	it('should convert to the target referer', function(done){
		var toProxyUrlFn = new urlHelper.ToProxyUrlFn(new FakeRequest({url: 'http://www.google.com'}));
		var url = 'http://www.github.com?search=what';

		headerRewriter(toProxyUrlFn(url), toProxyUrlFn, function(targetReferer){
			assert.equal(targetReferer, url);
			done();
		});
	});
});
