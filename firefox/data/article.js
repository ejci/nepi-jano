// try {
	//this is not pretty but who cares
	var isPiano1 = ($('#article-box #itext_content .art-perex-piano').length != 0);
	var isPiano2 = ($('#article-box #itext_content .art-nexttext-piano').length != 0);
	if (isPiano1 || isPiano2) {
		//console.log('Nepi Jano: Changing content :) ');
		var articleId = utils.articleId();
		if (articleId) {
			//css3 "magic"
			$('#article-box #itext_content').attr('style', 'transition: all 1s ease-in-out');
			$('#article-box #itext_content').attr('style', 'filter: blur(8px);');
			//get article id from URL
			var url = 'http://s.sme.sk/export/phone/html/?cf=' + articleId;
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					//$('#article-box #itext_content').empty();
					var data = xhr.responseText;
					//remove javascript from response
					data = data.replace(/<script/g, '<!--script');
					data = data.replace(/<\/script/g, '</script--');
					//some magic
					$('#article-box #itext_content').html(data);
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
					var t = setTimeout(function() {
						$('#article-box #itext_content').attr('style', 'filter: none;');
					}, 500);

				}
			}
			xhr.open("GET", url, true);
			xhr.send();
		}
	}
// } catch(e) {
// 	console.error('Nepi Jano: error', e);
// }