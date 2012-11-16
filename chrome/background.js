chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
	for (var i = 0; i < details.requestHeaders.length; ++i) {
		//remove ua string :)
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