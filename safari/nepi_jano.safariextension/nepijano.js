/**
 * @fileOverview Nepi Jano Google Chrome extension
 * @author Miroslav Magda, http://blog.ejci.net
 * @version 0.10.0
 */

/**
 * some utils
 */
var utils = {};

/**
 * Get parameter from url (if exists)
 */
utils.urlParam = function(name, url) {
	url = (url) ? url : window.location.href;
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(url);
	if (results === null) {
		return false;
	} else {
		return results[1];
	}
	return false;
};

/**
 * Remove elemtns with selector from document
 */
utils.removeSelector = function(doc, selector) {
	var elements = doc.querySelectorAll(selector);
	var i = elements.length;
	while (i--) {
		elements[i].parentNode.removeChild(elements[i]);
	}
	return doc;
};

/**
 * Fix urls in anchors
 */
utils.fixAnchors = function(doc) {
	var elements = doc.querySelectorAll('a');
	var i = elements.length;
	while (i--) {
		var url = elements[i].getAttribute('href');
		var articleId = utils.urlParam('c', url);
		var galleryId = utils.urlParam('g', url);
		if (/s.sme.sk\//i.test(url) && articleId) {
			elements[i].setAttribute('href', document.location.protocol + '//' + document.location.hostname + '/c/' + articleId + '/');
		}
		if (/s.sme.sk\//i.test(url) && galleryId) {
			elements[i].setAttribute('href', document.location.protocol + '//' + document.location.hostname + '/galeria/' + galleryId + '/' + Math.random().toString(36).substr(2, length) + '/');
		}

	}
	return doc;
};
/**
 * Fix video tags
 */
utils.fixVideos = function(doc) {
	var elements = doc.querySelectorAll('.iosvideo');
	var i = elements.length;
	while (i--) {
		var videoUrl = elements[i].querySelector('a[href$=mp4]').getAttribute('href');
		var videoPosterUrl = elements[i].querySelector('.videoimg').getAttribute('src');
		elements[i].innerHTML = '<video src="' + videoUrl + '" controls poster="' + videoPosterUrl + '" width="100%" preload="none">';
	}
	return doc;
};
/**
 * Get article id from url
 */
utils.articleId = function() {
	var articleId = document.location.pathname.split('/')[2];
	if (parseInt(articleId, 10) == articleId) {
		return articleId;
	} else {
		return false;
	}
	return false;
};

/**
 * Get article id from url
 */
utils.isPiano = function() {
	var ret = false;
	var selectors = [];
	selectors.push('#article-box #itext_content .art-perex-piano');
	selectors.push('#article-box #itext_content .art-nexttext-piano');
	selectors.push('#article-box div[id^=pianoArticle]');
	for (var i = 0, l = selectors.length; i < l; i++) {
		ret = ret || (document.querySelectorAll(selectors[i]).length != 0);
	}
	return ret;
};

if (/sme.sk\/c\//i.test(document.location)) {
	if (utils.isPiano()) {
		var articleId = utils.articleId();
		safari.self.tab.dispatchMessage("doXhr", 'http://s.sme.sk/export/ma/?c=' + articleId);
	}
}

safari.self.addEventListener("message", function(responseText) {
	var doc = (new DOMParser()).parseFromString(responseText, "text/html");
	doc = utils.removeSelector(doc, 'script');
	doc = utils.removeSelector(doc, 'link');
	doc = utils.removeSelector(doc, 'style');
	doc = utils.removeSelector(doc, '.button-bar');
	doc = utils.fixAnchors(doc);
	doc = utils.fixVideos(doc);
	cb(doc.querySelector('.articlewrap'));
	document.querySelector('#article-box #itext_content').innerHTML = html.innerHTML;
}, false);
