/**
 * @fileOverview Nepi Jano Google Chrome extension
 * @author Miroslav Magda, http://blog.ejci.net
 * @version 0.10.0
 */

/**
 * For each request to sme.sk remove UA string
 */
chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
	for (var i = 0; i < details.requestHeaders.length; ++i) {
		//remove UA string :)
		if (details.requestHeaders[i].name.toLowerCase() == 'user-agent') {
			details.requestHeaders.splice(i, 1);
			break;
		}
	}
	return {
		requestHeaders : details.requestHeaders
	};
}, {
	urls : ["*://*.sme.sk/*"]
}, ["blocking", "requestHeaders"]);
