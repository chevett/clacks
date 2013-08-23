 var assert = require('assert');
 var settings = require('./settings')();
	
 describe('url-helper', function(){
 
 	describe('createProxyUrlRewriter(...)', function(){
 	
		describe('has no request context', function(){

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

		describe('has a request context', function(){
		
			var request = {
				url: '/github.com',
				headers: [
				]
			};

			it('should handle relative urls', function(){
 				var urlHelper = require('./url-helper');
				var url = '/chevett';
				var urlRewriter = urlHelper.createProxyUrlRewriter(request);

				var port = settings.port==80 ? '' : ':' + settings.port;
				assert.equal(urlRewriter(url), 'http://'+settings.hostname+port+'/github.com/chevett');
			});
		

			it('should handle really relative urls', function(){
 				var urlHelper = require('./url-helper');
				var url = '/chevett';
				var urlRewriter = urlHelper.createProxyUrlRewriter(request);

				var port = settings.port==80 ? '' : ':' + settings.port;
				assert.equal(urlRewriter(url), 'http://'+settings.hostname+port+'/github.com/chevett');
			});
		});
	});
			
 
 });
