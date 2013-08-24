 var assert = require('assert');
 var settings = require('./settings')();
	
 describe('url-helper', function(){
 
 	describe('#createToProxyUrlFn(null)', function(){
 	
		describe('has no request context', function(){

			it('should handle absolute url', function (){
 				var urlHelper = require('./url-helper');
				var url = 'http://www.google.com';
				var urlRewriter = urlHelper.createToProxyUrlFn(null);

				var port = settings.port==80 ? '' : ':' + settings.port;
				assert.equal(urlRewriter(url), 'http://'+settings.hostname+port+'/www.google.com');
			});

			it('should keep trailing slash', function (){
 				var urlHelper = require('./url-helper');
				var url = 'http://www.google.com/';
				var urlRewriter = urlHelper.createToProxyUrlFn(null);

				var port = settings.port==80 ? '' : ':' + settings.port;
				assert.equal(urlRewriter(url), 'http://'+settings.hostname+port+'/www.google.com/');
			});

			it('shouldn\'t handle relative urls', function(){
 				var urlHelper = require('./url-helper');
				var url = '/chevett';
				var urlRewriter = urlHelper.createToProxyUrlFn();

				assert.equal(urlRewriter(url), null);
			});
		});

		describe('has a request context', function(){
		
			it('should handle relative urls', function(){
				var request = {
					url: '/github.com',
					headers: [
					]
				};
 				var urlHelper = require('./url-helper');
				var url = '/chevett/miketown3';
				var urlRewriter = urlHelper.createToProxyUrlFn(request);

				var port = settings.port==80 ? '' : ':' + settings.port;
				assert.equal(urlRewriter(url), 'http://'+settings.hostname+port+'/github.com/chevett/miketown3');
			});
		

			it('should handle really relative urls', function(){
				var request = {
					url: '/github.com/chevett/',
					headers: [
					]
				};
 				var urlHelper = require('./url-helper');
				var url = 'miketown3';
				var urlRewriter = urlHelper.createToProxyUrlFn(request);

				var port = settings.port==80 ? '' : ':' + settings.port;
				assert.equal(urlRewriter(url), 'http://'+settings.hostname+port+'/github.com/chevett/miketown3');
			});
		});
	});
			
 
 	describe('#createFromProxyUrlFn(null)', function(){
		it('should convert bland url', function(){
			var fromProxyUrlFn = require('./url-helper').createFromProxyUrlFn({
				url: '/github.com',
				headers: [
				]
			});
			var url = '/github.com/chevett/miketown3';

			assert.equal(fromProxyUrlFn(url), 'http://github.com/chevett/miketown3');
		});
		
		it('should preserve trailing slash', function(){
			var fromProxyUrlFn = require('./url-helper').createFromProxyUrlFn({
				url: '/github.com',
				headers: [
				]
			});
			var url = '/github.com/chevett/miketown3/';

			assert.equal(fromProxyUrlFn(url), 'http://github.com/chevett/miketown3/');
		});

		it('should preserve querystring parameters', function(){
			var fromProxyUrlFn = require('./url-helper').createFromProxyUrlFn({
				url: '/github.com',
				headers: [
				]
			});
			var url = '/github.com/chevett/miketown3?name1=value1&name2=value2';

			assert.equal(fromProxyUrlFn(url), 'http://github.com/chevett/miketown3?name1=value1&name2=value2');
		});
	});
 });
