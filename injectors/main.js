module.exports = function($){
	$('head')
		.prepend('<script src="/js/main.js"></script>')
		.prepend('<script src="//cdnjs.cloudflare.com/ajax/libs/URI.js/1.7.2/URI.min.js"></script>');
};