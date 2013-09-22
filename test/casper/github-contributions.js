/* global casper: false */

casper.test.begin('githib contributions graph loads', function(test){
	casper.start('http://www.miketown3.com/http://github.com/chevett', function(){
	});

	casper.waitForSelector('.calendar-graph svg g g', function(){
		this.captureSelector('./github-contributions.png', 'html');
	});

	casper.run(function(){
		test.done();
	});
});
