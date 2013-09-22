/* global casper: false */

casper.test.begin('githib contributions graph loads', function(test){
	casper.start('http://www.miketown3.com/http://github.com/chevett', function(){
		this.echo(this.getTitle());
	});

	casper.waitForSelector('.calendar-graph svg g g', function(){
		this.captureSelector('./github-contributions.png', 'html');
		this.test.pass('contributions graph found.');
	}, function(){
		this.test.fail('contributes graph NOT found.');
	});

	casper.run(function(){
		test.done();
	});
});
