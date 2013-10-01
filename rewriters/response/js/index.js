var esprima = require('esprima');
var escodegen = require('escodegen');
var traverse = require('traverse');
var _ = require('underscore');

function _mt3_convert(value, ctx, targetName){
	// this will look at the value and attempt to convert the value
	// if the value looks like a url.

	if (!value) return value;
	if (typeof value !== 'string') return value;

	// if the target name is super suspicious, like src or href
	var shouldConvert = targetName && urlPropertyNames[targetName.toLowerCase()];

	// if it's absolute then convert no problem!
	shouldConvert = shouldConvert || /^\s*(http:|https:|\/\/)/i.test(value);

	// if looks like a file then just go for it.
	shouldConvert = shouldConvert || /\.(js|html|php|aspx)($|\?)/i.test(value);

	// just give it a good eyeballing
	shouldConvert = shouldConvert || /.*?\/.*?\?.+?=.*?/i.test(value);

	if (shouldConvert) {
		return ctx.convert.toProxyUrl(value) || value;
	}

	return value;
}

function _expressionWrap(expression, functionName){
	// this wraps an expression with a function call

	switch (expression.type)
	{
		case 'FunctionExpression':
			return expression;

		default:
			return {
				type: 'CallExpression',
				arguments: [expression],
				callee: { type: 'Identifier', name: functionName },
				ignore: true
			};
	}
}

function _getAssignmentTargetName(assignmentNode){
	var left = assignmentNode.left;

	switch (left.type){
		case 'Identifier':
			return left.name;

		case 'MemberExpression':
			// punting on computed for now.
			if (left.computed) return null;

			return left.property.name;

		default:
			return null;
	}
}

var urlPropertyNames = {'src': true, 'href': true};
function _interceptAssignment(assignmentNode, ctx){
	var targetName = _getAssignmentTargetName(assignmentNode);
	var right = assignmentNode.right;

	switch (right.type) {
		case 'ObjectExpression':
			return;

		case 'Literal':
			if (typeof right.value === 'string') {
				right.value = _mt3_convert(right.value, ctx, targetName);
				right.ignore = true;
			}

		return;
	}

	var wrapperName = urlPropertyNames[targetName] ? '__mt3_' : '_mt3_';
	assignmentNode.right = _expressionWrap(assignmentNode.right, wrapperName);
}

function _interceptArguments(callNode, ctx){
	for (var x=0; x<callNode.arguments.length; x++){
		var arg = callNode.arguments[x];

		// convert literals server side if possible
		if (arg.type === 'Literal'){
			arg.value = _mt3_convert(arg.value, ctx);
			continue;
		}

		// convert variables/expressions during runtime if possible
		callNode.arguments[x] = _expressionWrap(arg, '_mt3_');
	}
}

function _interceptProperty(propertyNode, ctx){
	if (propertyNode.value.type !== 'Literal') return; // punting for now.

	propertyNode.value.value = _mt3_convert(propertyNode.value.value, ctx, propertyNode.key.name);
}

function _rewrite(js, ctx){
	var tree = esprima.parse(js);

	traverse(tree).forEach(function(node){
		if (!node || node.ignore) return;

		if (node.type === 'AssignmentExpression'){
			_interceptAssignment(node, ctx);
		}

		if (node.type === 'CallExpression'){
			_interceptArguments(node, ctx);
		}

		if (node.type === 'Property'){
			_interceptProperty(node, ctx);
		}

		if (node.type === 'Literal'){
			node.value = _mt3_convert(node.value, ctx);
		}
	});

	//console.log(escodegen.generate(tree));


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
