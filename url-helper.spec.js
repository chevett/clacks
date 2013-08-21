 var assert = require('assert');
 var settings = require('./settings')();
	
 describe('url-helper', function(){
 
	 
 	describe('urlRewriter', function(){
 	
		it('should handle absolute url without a valid request', function (){
 			var urlHelper = require('./url-helper');
			var url = 'http://www.google.com';
			var urlRewriter = urlHelper.createProxyUrlRewriter(null);

			var port = settings.port==80 ? '' : ':' + settings.port;
			assert.equal(urlRewriter(url), 'http://'+settings.hostname+port+'/www.google.com');
		});
	});
			
 
 });
