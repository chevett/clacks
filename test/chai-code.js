var esprima = require('esprima');
var escodegen = require('escodegen');

module.exports = function(chai, utils){

	var Assertion = chai.Assertion;
	
	Assertion.addMethod('func', function(b){
		var a = this._obj;
		if (typeof a === 'function') a = String(a);
		if (typeof b === 'function') b = String(b);

		a = escodegen.generate(esprima.parse(a));
		b = escodegen.generate(esprima.parse(b));
	
		this.assert(
			a === b,
			'the functions are not the same: ' + b + a,
			'the functions are the same.'
		);
	});
};
