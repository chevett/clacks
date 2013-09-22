var esprima = require('esprima');
var escodegen = require('escodegen');

function traverse(object, visitor) {
	var key, child;

	visitor.call(null, object);

	for (key in object) {
		if (!object.hasOwnProperty(key)) continue; 
		child = object[key];
		if (typeof child === 'object' && child !== null) {
			traverse(child, visitor);
		}
	}
}

function _checkString(str, ctx){
	try {
		//if (/^http:\/\//i.test(str)) return ctx.server.url + str;
		//if (/^https:\/\//i.test(str)) return ctx.server.secureUrl + str;

		return str;
	} catch (e){
		console.log('error in js rewriter.');
		console.log(str);
		return str;
	}
}


module.exports = function(js, ctx) {
	var tree = esprima.parse(js);

	traverse(tree, function(node){
		if (node.type === 'Literal' && typeof node.value === 'string'){
			node.value = _checkString(node.value, ctx);
		}

	});
	
    return escodegen.generate(tree);
};
