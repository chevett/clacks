 var assert = require('assert');
 var settings = require('./settings')();
	
 describe('url-helper', function(){

	describe('#createToProxyUrlFn(...)(...)', function(){

		it('should convert absolute urls when there is no request context', function (){
			var url = 'http://www.google.com';
			var toProxyUrlFn = require('./url-helper').createToProxyUrlFn(null);

			var port = settings.port==80 ? '' : ':' + settings.port;
			assert.equal(toProxyUrlFn(url), 'http://'+settings.hostname+port+'/www.google.com');
		});

		it('should convert relative urls when there is a request context', function(){
			var url = '/chevett/miketown3';
			var toProxyUrlFn = require('./url-helper').createToProxyUrlFn({
				url: '/github.com',
				headers: [
				]
			});

			var port = settings.port==80 ? '' : ':' + settings.port;
			assert.equal(toProxyUrlFn(url), 'http://'+settings.hostname+port+'/github.com/chevett/miketown3');
		});
		
		it('should create secure absolute urls from relative urls when there is a secure request context', function(){
			var url = '/chevett/miketown3';
			var toProxyUrlFn = require('./url-helper').createToProxyUrlFn({
				url: '/github.com',
				secure: true, 
				headers: {
					'x-forwarded-proto': 'https'
				}
			});

			var port = settings.port==443 ? '' : ':' + settings.sslPort;
			assert.equal(toProxyUrlFn(url), 'https://'+settings.hostname+port+'/github.com/chevett/miketown3');
		});

		it('should preserve the protocol override from the context when creating relative urls', function(){
			var url = '/chevett/miketown3';
			var toProxyUrlFn = require('./url-helper').createToProxyUrlFn({
				url: '/http/github.com',
				secure: true, 
				headers: {
					'x-forwarded-proto': 'https'
				}
			});

			var port = settings.port==443 ? '' : ':' + settings.sslPort;
			assert.equal(toProxyUrlFn(url), 'https://'+settings.hostname+port+'/http/github.com/chevett/miketown3');
		});

		it('should convert really relative urls when there is a request context', function(){
			var url = 'miketown3';
			var toProxyUrlFn = require('./url-helper').createToProxyUrlFn({
				url: '/github.com/chevett/',
				headers: [
				]
			});

			var port = settings.port==80 ? '' : ':' + settings.port;
			assert.equal(toProxyUrlFn(url), 'http://'+settings.hostname+port+'/github.com/chevett/miketown3');
		});

		it('shouldn\'t convert relative urls when there is no request context', function(){
			var url = '/chevett';
			var toProxyUrlFn = require('./url-helper').createToProxyUrlFn();

			assert.equal(toProxyUrlFn(url), null);
		});
		
		it('should preserve querystring parameters', function(){
			var url = '/github.com/chevett/miketown3?name1=value1&name2=value2';
			var toProxyUrlFn = require('./url-helper').createFromProxyUrlFn({
				url: '/github.com',
				headers: [
				]
			});

			assert.equal(toProxyUrlFn(url), 'http://github.com/chevett/miketown3?name1=value1&name2=value2');
		});
		
		it('should preserve the trailing slash in an absolute url when there is no request context', function (){
			var url = 'http://www.google.com/';
			var toProxyUrlFn = require('./url-helper').createToProxyUrlFn(null);

			var port = settings.port==80 ? '' : ':' + settings.port;
			assert.equal(toProxyUrlFn(url), 'http://'+settings.hostname+port+'/www.google.com/');
		});
		
		it('should preserve non-standard port', function (){
			var url = 'http://www.google.com:555/';
			var toProxyUrlFn = require('./url-helper').createToProxyUrlFn(null);

			var port = settings.port==80 ? '' : ':' + settings.port;
			assert.equal(toProxyUrlFn(url), 'http://'+settings.hostname+port+'/555/www.google.com/');
		});
		
		it('should preserve protocol from absolute url', function (){
			var url = 'https://www.google.com';
			var toProxyUrlFn = require('./url-helper').createToProxyUrlFn(null);

			var port = settings.port==443 ? '' : ':' + settings.sslPort;
			assert.equal(toProxyUrlFn(url), 'https://'+settings.hostname+port+'/www.google.com');
		});
	});
			
 
	describe('#createFromProxyUrlFn(...)(...)', function(){
		it('should convert valid url', function(){
			var url = '/github.com/chevett/miketown3';
			var fromProxyUrlFn = require('./url-helper').createFromProxyUrlFn({
				url: '/github.com',
				headers: [
				]
			});

			assert.equal(fromProxyUrlFn(url), 'http://github.com/chevett/miketown3');
		});
		
		it('should preserve trailing slash in a valid url', function(){
			var url = '/github.com/chevett/miketown3/';
			var fromProxyUrlFn = require('./url-helper').createFromProxyUrlFn({
				url: '/github.com',
				headers: [
				]
			});

			assert.equal(fromProxyUrlFn(url), 'http://github.com/chevett/miketown3/');
		});

		it('should preserve querystring parameters', function(){
			var url = '/github.com/chevett/miketown3?name1=value1&name2=value2';
			var fromProxyUrlFn = require('./url-helper').createFromProxyUrlFn({
				url: '/github.com',
				headers: [
				]
			});

			assert.equal(fromProxyUrlFn(url), 'http://github.com/chevett/miketown3?name1=value1&name2=value2');
		});

		it('should preserve https from the request context', function(){
			var url = '/github.com/chevett/miketown3';
			var fromProxyUrlFn = require('./url-helper').createFromProxyUrlFn({
				url: '/github.com',
				secure: true, 
				headers: {
					'x-forwarded-proto': 'https'
				}
			});

			assert.equal(fromProxyUrlFn(url), 'https://github.com/chevett/miketown3');
		});

		it('should respect http override', function(){
			var url = '/http/github.com/chevett/miketown3';
			var fromProxyUrlFn = require('./url-helper').createFromProxyUrlFn({
				url: '/github.com',
				secure: true, 
				headers: {
					'x-forwarded-proto': 'https'
				}
			});

			assert.equal(fromProxyUrlFn(url), 'http://github.com/chevett/miketown3');
		});
		
		it('should respect port override', function(){
			var url = '/8888/github.com/chevett/miketown3?name1=value1&name2=value2';
			var fromProxyUrlFn = require('./url-helper').createFromProxyUrlFn({
				url: '/github.com',
				secure: true, 
				headers: {
					'x-forwarded-proto': 'https'
				}
			});

			assert.equal(fromProxyUrlFn(url), 'https://github.com:8888/chevett/miketown3?name1=value1&name2=value2');
		});

		it('should respect port and protocol override', function(){
			var url = '/8080/http/github.com/chevett/miketown3?name1=value1&name2=value2';
			var fromProxyUrlFn = require('./url-helper').createFromProxyUrlFn({
				url: '/github.com',
				secure: true, 
				headers: {
					'x-forwarded-proto': 'https'
				}
			});

			assert.equal(fromProxyUrlFn(url), 'http://github.com:8080/chevett/miketown3?name1=value1&name2=value2');
		});
	});
 });
