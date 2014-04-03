self.port.on("rewritePage", function(text) {
	//remove javascript from response
	text = text.replace(/<script/g, '<!--script');
	text = text.replace(/<\/script/g, '</script--');
	//some magic
	$('.video').html(text);
	$('.video h1').hide();
	$('.video style').remove();
	$('.v-podcast-box').remove();
	$('.video').prepend('<video src="' + $($('.video .iosvideo a')[0]).attr('href') + '" controls poster="' + $($('.video .iosvideo img')[0]).attr('src') + '" width="640" height="360">');
	$('.video .tv-video').hide();
});

//check for piano content (message)
var isPiano = ($('.tvpiano').length != 0);
if (isPiano) {
	var articleId = utils.articleId();
	if (articleId) {
		self.port.emit('loadPage', articleId);
	}
}