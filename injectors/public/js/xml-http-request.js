(function(){
	var reallySend = XMLHttpRequest.prototype.send;
	XMLHttpRequest.prototype.send = function() {

		console.log(this);
		reallySend.apply(this, arguments);
	};
})();
