/**
* some utils
*/
var utils = {};

/**
* get parameter from url (if exists)
*/
utils.urlParam = function(name, url) {
	url = (url) ? url : window.location.href;
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(url);
	if (results !== null) {
		return results[1];
	}
	return false;
};

/**
* Article ID
*/
utils.articleId = function() {
	var articleId = document.location.pathname.split('/')[2];
	if (parseInt(articleId, 10) == articleId) {
		return articleId;
	}
	return false;
};