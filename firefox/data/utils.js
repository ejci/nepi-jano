/**
* some utils
*/
var utils = {};

/**
* article ID
*/
utils.articleId = function() {
	var articleId = document.location.pathname.split("/")[2];
	if ( parseInt( articleId, 10 ) == articleId ) {
		return articleId;
	}
	return false;
};

/**
 * remove element (if exists)
 */
utils.remove = function(e) {
	if (e != null) {
		e.remove(e);
	}
}
