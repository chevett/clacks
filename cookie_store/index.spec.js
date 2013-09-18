var CookieStore = require('./index.js');
var expect = require('chai').expect;
 
describe('cookie store', function(){
	it('should be reasonable', function(done){
		var cookieStore = new CookieStore({
			userId:'xj9000',
			url: 'https://accounts.google.com/login'
		});

		cookieStore.setCookies([
				'GAPS=1:aVnF72zYdkaERhd6Oh6jQyzYUw3Idw:l4q4QjpB4tYX1ruW;Path=/;Expires=Thu, 17-Sep-2025 01:02:11 GMT;Secure;HttpOnly;Priority=High',
				'GALX=l2QZx_aQmA;Path=/;Secure'
			]);

		cookieStore = new CookieStore({
			userId: 'xj9000',
			url: 'https://accounts.google.com/ServiceLoginAuth'
		});

		cookieStore.getCookieHeader(function(cookieHeader){
			expect(cookieHeader).to.be.equal('GAPS=1:aVnF72zYdkaERhd6Oh6jQyzYUw3Idw:l4q4QjpB4tYX1ruW; GALX=l2QZx_aQmA');
			done();
		});
	});
});


