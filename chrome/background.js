/**
 * @fileOverview Nepi Jano Google Chrome extension
 * @author Miroslav Magda, http://blog.ejci.net
 * @version 0.9.5
 */

/**
 * Before reqeust is send remove UA string
 * Message to developers: never trust the client and always check inputs
 */
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
