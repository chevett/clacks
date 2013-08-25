exports.createSecureRequest = function(url){
	return {
		url: url, 
			secure: true,
			headers:{
				'x-forwarded-proto': 'https'
			}
	};
};
exports.createRequest = function(url){
	return {
		url: url, 
		headers: {}
	};
};
