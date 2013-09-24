var esprima = require('esprima');
var escodegen = require('escodegen');
var traverse = require('traverse');


function _checkString(str, ctx){
	//if (/^http:\/\//i.test(str)) return ctx.server.url + str;
	//if (/^https:\/\//i.test(str)) return ctx.server.secureUrl + str;

	return str;
}

function _rewrite(js, ctx){
	var tree = esprima.parse(js);

	traverse(tree).forEach(function(node){
		//console.log(node);
		if (node.type === 'Literal' && typeof node.value === 'string'){
			node.value = _checkString(node.value, ctx);
			this.update(node, true);
		}

	});
	
    return escodegen.generate(tree);
}
module.exports = function(js, ctx) {
	try {
		return _rewrite(js, ctx);
	} catch (e){
		console.log('failed parsing js: ' + ctx.target.url);
		console.log(e);
		return js;
	}
};
