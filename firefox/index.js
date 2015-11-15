var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod").PageMod;
var request = require("sdk/request").Request;

pageMod({
	include : /.*\.sme\.sk\/c\/\d+\/.*/,
	contentScriptFile : data.url("nepijano.js"),
	onAttach : function(worker) {
		worker.port.on("loadPage", function(url) {
			request({
				url : url,
				headers : {
					"User-Agent" : "",
				},
				onComplete : function(response) {
					if (response.status == 200) {
						worker.port.emit("rewritePage", response.text);
					}
				}
			}).get();
		});
	}
});
