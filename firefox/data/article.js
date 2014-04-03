self.port.on("rewritePage", function(text) {
	//remove javascript from response
	text = text.replace(/<script/g, '<!--script');
	text = text.replace(/<\/script/g, '</script--');
	//some magic
	$('#article-box #itext_content').html(text);
	$('#article-box #itext_content h1').hide();
	$('#article-box #itext_content .topfoto').hide();
	$('#article-box #itext_content .discus').hide();
	$('#article-box #itext_content link').remove();
	$('#article-box #itext_content style').remove();
	$('#article-box a').each(function(index) {
		//change s.sme.sk/export/phone/?c=XXX to www.sme.sk/c/XXX/
		var url = $(this).attr('href');
		var cId = utils.urlParam('c', $(this).attr('href'));
		if (/s.sme.sk\//i.test(url) && cId) {
			$(this).attr('href', 'http://www.sme.sk/c/' + cId + '/');
		}
	});
});

//this is not pretty but who cares
var isPiano1 = ($('#article-box #itext_content .art-perex-piano').length != 0);
var isPiano2 = ($('#article-box #itext_content .art-nexttext-piano').length != 0);
if (isPiano1 || isPiano2) {
	var articleId = utils.articleId();
	if (articleId) {
		self.port.emit('loadPage', articleId);
	}
}