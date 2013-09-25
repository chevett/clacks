var esprima = require('esprima');
var escodegen = require('escodegen');
var traverse = require('traverse');

function _parseFragment(code){
	return esprima.parse('function fuuuck(){' + code + '}').body[0].body.body[0];
}

function _checkString(str, ctx){
	if (/^http:\/\//i.test(str)) return ctx.server.url + str;
	if (/^https:\/\//i.test(str)) return ctx.server.secureUrl + str;

	return str;
}
function _interceptFunction(functionNode){
	var ohGeeBody = functionNode.body;
	var funcDec = esprima.parse(String(function test(){
	})).body[0];

	funcDec.body = ohGeeBody;
	funcDec.id.name  = '_' + functionNode.id.name;

	functionNode.body = {
		type: 'BlockStatement',
		body: [funcDec]
	};

	var frag = _parseFragment('return _mt3(' + funcDec.id.name + '.apply(this, arguments));');

	functionNode.body.body.push(frag);
}

function _rewrite(js, ctx){
	var tree = esprima.parse(js), returnOriginal = true;

	traverse(tree).forEach(function(node){
		if (!node) return;

		if (node.type === 'FunctionDeclaration'){
			_interceptFunction(node);
			returnOriginal = false;
			this.update(node, true);
		}

		if (node.type === 'CallExpression'){
			// do something smart here
		}

	});

	if (returnOriginal) return js;

	return String(function _mt3(x){
		if (typeof x !== 'string') return x;
		if (console && console.log){console.log(x);}

		return x;
	})+escodegen.generate(tree);
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
