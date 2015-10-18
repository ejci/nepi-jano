/**
 * @fileOverview Nepi Jano Google Chrome extension
 * @author Miroslav Magda, http://blog.ejci.net
 * @author Richard Toth (fix of design changes on sme.sk)
 * @version 0.10.1
 */

(function() {
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
	 * Get mobile version article
	 */
	utils.getArticle = function(cb) {
		var articleId = utils.articleId();
		request = new XMLHttpRequest();
		request.open('GET', 'http://s.sme.sk/export/ma/?c=' + articleId, true);
		request.onload = function() {
			if (request.status >= 200 && request.status < 400) {
				var doc = (new DOMParser()).parseFromString(request.responseText, "text/html");
				doc = utils.removeSelector(doc, 'script');
				doc = utils.removeSelector(doc, 'link');
				doc = utils.removeSelector(doc, 'style');
				doc = utils.removeSelector(doc, '.button-bar');
				doc = utils.fixAnchors(doc);
				doc = utils.fixVideos(doc);
				cb(doc.querySelector('article'));
			}
		};
		request.send();
	};

	/**
	 * Get article id from url
	 */
	utils.isPiano = function() {
		var ret = false;
		var selectors = [];
		selectors.push('article.editorial-promo-on');
		selectors.push('article div[id^=pianoSmePromo]');
		for (var i = 0, l = selectors.length; i < l; i++) {
			ret = ret || (document.querySelectorAll(selectors[i]).length != 0);
		}
		return ret;
	};

	if (/sme.sk\/c\//i.test(document.location)) {
		if (utils.isPiano()) {
			utils.getArticle(function(html) {
				document.querySelector('article.editorial-promo-on').innerHTML = html.innerHTML;
			});
		}
	}
})();
