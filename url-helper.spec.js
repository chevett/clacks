 var assert = require('assert');
 var settings = require('./settings')();
	
 describe('url-helper', function(){
 
 	describe('createProxyUrlRewriter(...)', function(){
 	
		describe('no request context', function(){

			it('should handle absolute url', function (){
 				var urlHelper = require('./url-helper');
				var url = 'http://www.google.com';
				var urlRewriter = urlHelper.createProxyUrlRewriter(null);

				var port = settings.port==80 ? '' : ':' + settings.port;
				assert.equal(urlRewriter(url), 'http://'+settings.hostname+port+'/www.google.com');
			});

			it('should keep trailing slash', function (){
 				var urlHelper = require('./url-helper');
				var url = 'http://www.google.com/';
				var urlRewriter = urlHelper.createProxyUrlRewriter(null);

				var port = settings.port==80 ? '' : ':' + settings.port;
				assert.equal(urlRewriter(url), 'http://'+settings.hostname+port+'/www.google.com/');
			});

		});
	});
			
 
 });
