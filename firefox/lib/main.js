var data = require("sdk/self").data;
var articleMod = require("sdk/page-mod").PageMod;
var videoMod = require("sdk/page-mod").PageMod;
var request = require("sdk/request").Request;

articleMod({
	include: /.*.sme.sk\/c\/.*/,
	contentScriptFile: [
		data.url("jquery-2.0.0.min.js"),
		data.url("utils.js"),
		data.url("article.js")
	],
	onAttach: function(worker) {
		worker.port.on("loadPage", function(articleId) {
			request({
				url: "http://s.sme.sk/export/phone/html/?cf=" + articleId,
				headers: {
					"User-Agent": "",
				},
				onComplete: function (response) {
					if (response.status == 200) {
						worker.port.emit("rewritePage", response.text);
					}
				}
			}).get();
		});
	}
});

videoMod({
	include: "*.tv.sme.sk",
	contentScriptFile: [
		data.url("jquery-2.0.0.min.js"),
		data.url("utils.js"),
		data.url("video.js")
	],
	onAttach: function(worker) {
		worker.port.on("loadPage", function(articleId) {
			request({
				url: "http://s.sme.sk/export/phone/html/?vf=" + articleId,
				headers: {
					"User-Agent": "",
				},
				onComplete: function (response) {
					if (response.status == 200) {
						worker.port.emit("rewritePage", response.text);
					}
				}
			}).get();
		});
	}
});