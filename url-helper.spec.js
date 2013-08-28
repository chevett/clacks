var assert = require('assert');
var settings = require('./settings')();
var testHelper = require('./test/helper');
var httpClacksHomeUrl = settings.createHttpUrl();
var httpsClacksHomeUrl = settings.createHttpsUrl();

 describe('url-helper', function(){

	describe('#createToProxyUrlFn(...)(...)', function(){

		it('should convert absolute urls when there is no request context', function (){
			var url = 'http://www.google.com/';
			var toProxyUrlFn = require('./url-helper').createToProxyUrlFn();

			assert.equal(toProxyUrlFn(url), httpClacksHomeUrl + 'http://www.google.com/');
		});

		it('should preserve https in absolute urls when there is no request context', function (){
			var url = 'https://www.google.com/';
			var toProxyUrlFn = require('./url-helper').createToProxyUrlFn();

			assert.equal(toProxyUrlFn(url), httpsClacksHomeUrl + 'https://www.google.com/');
		});

		it('should convert relative urls when there is a request context', function(){
			var url = '/chevett/miketown3';
			var toProxyUrlFn = require('./url-helper').createToProxyUrlFn(testHelper.createRequest('github.com'));

			var port = settings.port==80 ? '' : ':' + settings.port;
			assert.equal(toProxyUrlFn(url), 'http://'+settings.hostname+port+'/http://github.com/chevett/miketown3');
		});
		
		it('should create secure absolute urls from relative urls when the parent request is secure', function(){
			var url = '/chevett/miketown3';
			var toProxyUrlFn = require('./url-helper').createToProxyUrlFn(testHelper.createSecureRequest('https://github.com'));

			var port = settings.port==443 ? '' : ':' + settings.sslPort;
			assert.equal(toProxyUrlFn(url), 'https://'+settings.hostname+port+'/https://github.com/chevett/miketown3');
		});

		it('should preserve the protocol override from the context when creating relative urls', function(){
			var url = '/chevett/miketown3';
			var toProxyUrlFn = require('./url-helper').createToProxyUrlFn(testHelper.createSecureRequest('http://github.com'));

			var port = settings.port==443 ? '' : ':' + settings.sslPort;
			assert.equal(toProxyUrlFn(url), 'https://'+settings.hostname+port+'/http://github.com/chevett/miketown3');
		});

		it('should convert really relative urls when there is a request context', function(){
			var url = 'miketown3';
			var toProxyUrlFn = require('./url-helper').createToProxyUrlFn(testHelper.createRequest('github.com/chevett/'));

			var port = settings.port==80 ? '' : ':' + settings.port;
			assert.equal(toProxyUrlFn(url), 'http://'+settings.hostname+port+'/http://github.com/chevett/miketown3');
		});

		it('shouldn\'t convert relative urls when there is no request context', function(){
			var url = '/chevett';
			var toProxyUrlFn = require('./url-helper').createToProxyUrlFn();

			assert.equal(toProxyUrlFn(url), null);
		});
		
		it('should preserve the trailing slash in an absolute url when there is no request context', function (){
			var url = 'http://www.google.com/';
			var toProxyUrlFn = require('./url-helper').createToProxyUrlFn();

			var port = settings.port==80 ? '' : ':' + settings.port;
			assert.equal(toProxyUrlFn(url), 'http://'+settings.hostname+port+'/http://www.google.com/');
		});
		
		it('should preserve non-standard port', function (){
			var url = 'http://www.google.com:555/';
			var toProxyUrlFn = require('./url-helper').createToProxyUrlFn();

			var port = settings.port==80 ? '' : ':' + settings.port;
			assert.equal(toProxyUrlFn(url), 'http://'+settings.hostname+port+'/http://www.google.com:555/');
		});
		
		it('should preserve protocol from absolute url', function (){
			var url = 'https://www.google.com/';
			var toProxyUrlFn = require('./url-helper').createToProxyUrlFn();

			assert.equal(toProxyUrlFn(url), httpsClacksHomeUrl+'https://www.google.com/');
		});
	});
			
 
	describe('#createFromProxyUrlFn(...)(...)', function(){
		it('should convert valid url', function(){
			var url = 'github.com/chevett/miketown3';
			var fromProxyUrlFn = require('./url-helper').createFromProxyUrlFn(testHelper.createRequest('github.com'));

			assert.equal(fromProxyUrlFn(url), 'http://github.com/chevett/miketown3');
		});
		
		it('should preserve trailing slash in a valid url', function(){
			var url = 'github.com/chevett/miketown3/';
			var fromProxyUrlFn = require('./url-helper').createFromProxyUrlFn(testHelper.createRequest('github.com'));

			assert.equal(fromProxyUrlFn(url), 'http://github.com/chevett/miketown3/');
		});

		it('should preserve querystring parameters', function(){
			var url = 'github.com/chevett/miketown3?name1=value1&name2=value2';
			var fromProxyUrlFn = require('./url-helper').createFromProxyUrlFn(testHelper.createRequest('github.com'));

			assert.equal(fromProxyUrlFn(url), 'http://github.com/chevett/miketown3?name1=value1&name2=value2');
		});

		it('should default to https for a secure connection with no protocol', function(){
			var url = 'github.com/chevett/miketown3';
			var fromProxyUrlFn = require('./url-helper').createFromProxyUrlFn(testHelper.createSecureRequest('github.com'));

			assert.equal(fromProxyUrlFn(url), 'https://github.com/chevett/miketown3');
		});

		it('should use protocol in the url regardless of the context', function(){
			var url = 'ftp://github.com/chevett/miketown3';
			var fromProxyUrlFn = require('./url-helper').createFromProxyUrlFn(testHelper.createSecureRequest('http://github.com'));

			assert.equal(fromProxyUrlFn(url), 'ftp://github.com/chevett/miketown3');
		});
	
		it('should respect http override', function(){
			var url = 'http://github.com/chevett/miketown3';
			var fromProxyUrlFn = require('./url-helper').createFromProxyUrlFn(testHelper.createSecureRequest('http://github.com'));

			assert.equal(fromProxyUrlFn(url), 'http://github.com/chevett/miketown3');
		});
		
		it('should respect port override', function(){
			var url = 'github.com:8888/chevett/miketown3?name1=value1&name2=value2';
			var fromProxyUrlFn = require('./url-helper').createFromProxyUrlFn(testHelper.createSecureRequest('github.com'));

			assert.equal(fromProxyUrlFn(url), 'https://github.com:8888/chevett/miketown3?name1=value1&name2=value2');
		});


		it('should respect port and protocol override', function(){
			var url = 'http://github.com:8080/chevett/miketown3?name1=value1&name2=value2';
			var fromProxyUrlFn = require('./url-helper').createFromProxyUrlFn(testHelper.createSecureRequest('github.com'));

			assert.equal(fromProxyUrlFn(url), 'http://github.com:8080/chevett/miketown3?name1=value1&name2=value2');
		});

		it('should use the referer to resolve invalid urls', function(){
			var request = testHelper.createRequest('chevett/clacks', testHelper.createProxyUrl('http://www.github.com'));
			var fromProxyUrlFn = require('./url-helper').createFromProxyUrlFn(request);

			assert.equal(fromProxyUrlFn('clacks'), 'http://www.github.com/chevett/clacks');
		});

		it('should use the referer to resolve invalid urls and preserve https', function(){
			var request = testHelper.createRequest('chevett/clacks', testHelper.createProxyUrl('https://www.github.com'));
			var fromProxyUrlFn = require('./url-helper').createFromProxyUrlFn(request);

			assert.equal(fromProxyUrlFn(request.url), 'https://www.github.com/chevett/clacks');
		});

		it('should use the referer to resolve invalid urls and then handle another relative url', function(){
			var request = testHelper.createRequest('chevett/clacks', testHelper.createProxyUrl('http://www.github.com'));
			var fromProxyUrlFn = require('./url-helper').createFromProxyUrlFn(request);

			assert.equal(fromProxyUrlFn('/miketown3'), 'http://www.github.com/miketown3');
		});

		it('should use the referer to resolve invalid urls and then handle another really relative url', function(){
			var request = testHelper.createRequest('chevett/clacks', testHelper.createProxyUrl('http://www.github.com'));
			var fromProxyUrlFn = require('./url-helper').createFromProxyUrlFn(request);

			assert.equal(fromProxyUrlFn('miketown3'), 'http://www.github.com/chevett/miketown3');
		});
	});
 });
