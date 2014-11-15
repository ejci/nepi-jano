self.port.on("rewritePage", function(text) {
	// extract just body content and remove useless tags
	text = text.replace(/[\s\S]*?<body>/, '');
	text = text.replace(/<\/body>[\s\S]*/, '');
	text = text.replace(/<link .*\/>/g, '');
	text = text.replace(/<script [\s\S]*?<\/script>/g, '');
	text = text.replace(/<style [\s\S]*?<\/style>/g, '');
	text = text.replace(/<h1>.*<\/h1>/g, '');

	var itext_content = document.getElementById("itext_content");
	itext_content.innerHTML = text;

	// tag removal based on its class is "safer" using DOM than string manipulation
	utils.remove(itext_content.querySelector(".topfoto"));
	utils.remove(itext_content.querySelector(".discus"));

	// remove annoying SME Android app banners
	var apps = itext_content.querySelectorAll('a[href="market://details?id=sk.sme.android.reader"]');
	for (var i = 0; i < apps.length; i++) {
		utils.remove(apps[i].parentNode);
	}

	// change s.sme.sk/export/phone/?c=XXX to www.sme.sk/c/XXX/
	var prefix = "http://s.sme.sk/export/phone/?c=";
	var anchors = document.getElementById("article-box").querySelectorAll('a[href^="' + prefix + '"]');
	for (var i = 0; i < anchors.length; i++) {
		anchors[i].href = "http://www.sme.sk/c/" + anchors[i].href.replace(prefix, "") + "/";
	}
});

// check for piano content (message)
var itext_content = document.getElementById("itext_content");
if (null != itext_content
	&& (null != itext_content.querySelector("div[id^=pianoArticle]")
		|| null != itext_content.querySelector(".art-nexttext-piano")
		|| null != itext_content.querySelector(".art-perex-piano"))) {
	var articleId = utils.articleId();
	if (articleId) {
		self.port.emit("loadPage", articleId);
	}
}
