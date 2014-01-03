var diff = require('diff');

function _wrapWithDel(line){
    return '<del>'+line+'</del>';
}

function _wrapWithIns(line){
    return '<ins>'+line+'</ins>';
}

function mydiff(oldStr, newStr){
	var result ='', diffResult = diff.diffWords(oldStr, newStr);

	for (var i=0; i < diffResult.length; i++) {

		if (diffResult[i].added && diffResult[i + 1] && diffResult[i + 1].removed) {
			var swap = diffResult[i];
			diffResult[i] = diffResult[i + 1];
			diffResult[i + 1] = swap;
		}

		if (diffResult[i].removed) {
			result += _wrapWithDel(diffResult[i].value);
		} else if (diffResult[i].added) {
			result += _wrapWithIns(diffResult[i].value);
		} else {
			result += diffResult[i].value;
		}
	}
	return result;
}


module.exports = mydiff;
