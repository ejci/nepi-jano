var data = require("sdk/self").data;
var articleMod = require("sdk/page-mod").PageMod;
var videoMod = require("sdk/page-mod").PageMod;
var request = require("sdk/request").Request;

articleMod({
	include : /.*.sme.sk\/c\/.*/,
	contentScriptFile : [data.url("nepijano.js")],
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
