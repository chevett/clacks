/* global casper: false */

casper.test.begin('githib contributions graph loads', function(test){
	casper.start('https://www.miketown3.com/https://github.com/chevett', function(){
		this.echo(this.getTitle());
	});

	casper.waitForSelector('.calendar-graph svg g g', function(){
		this.captureSelector('./github-contributions.png', 'html');
	});

	casper.run(function(){
		test.done();
	});
});
