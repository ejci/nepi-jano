var data = require("sdk/self").data;
var articleMod = require("sdk/page-mod");
var videoMod = require("sdk/page-mod");

articleMod.PageMod({
	include: /.*.sme.sk\/c\/.*/,
	contentScriptFile: [
		data.url("jquery-2.0.0.min.js"),
		data.url("utils.js"),
		data.url("article.js")
	]
});

videoMod.PageMod({
	include: "*.tv.sme.sk",
	contentScriptFile: [
		data.url("jquery-2.0.0.min.js"),
		data.url("utils.js"),
		data.url("video.js")
	]
});