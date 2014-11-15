self.port.on("rewritePage", function(text) {
	// extract just body content and remove useless tags
	text = text.replace(/[\s\S]*?<body>/, '');
	text = text.replace(/<\/body>[\s\S]*/, '');
	text = text.replace(/<link .*\/>/g, '');
	text = text.replace(/<script [\s\S]*?<\/script>/g, '');
	text = text.replace(/<style [\s\S]*?<\/style>/g, '');
	text = text.replace(/<h1>.*<\/h1>/g, '');

	var tmp = document.createElement("div");
	tmp.innerHTML = text;
	var iosvideo = tmp.querySelector(".iosvideo");

	document.querySelector(".video").innerHTML =
		'<video src="'
		+ iosvideo.querySelector("a").href
		+ '" controls poster="'
		+ iosvideo.querySelector("img").src
		+ '" width="640" height="360">';

	utils.remove(document.querySelector(".v-podcast-box"));
});

// check for piano content (message)
if (null != document.querySelector(".tvpiano")) {
	var articleId = utils.articleId();
	if (articleId) {
		self.port.emit("loadPage", articleId);
	}
}