// try {
	//check for piano content (message)
	var isPiano = ($('.tvpiano').length != 0);
	if (isPiano) {
		//console.log('Nepi Jano: Changing content :) ');
		var articleId = utils.articleId();
		if (articleId) {
			//css3 "magic"
			$('.video').attr('style', 'transition: all 1s ease-in-out');
			$('.video').attr('style', 'filter: blur(8px);');
			//get article id from URL
			var url = 'http://s.sme.sk/export/phone/html/?vf=' + articleId;
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					var data = xhr.responseText;
					//remove javascript from response
					data = data.replace(/<script/g, '<!--script');
					data = data.replace(/<\/script/g, '</script--');
					//some magic
					$('.video').html(data);
					$('.video h1').hide();
					$('.video style').remove();
					$('.v-podcast-box').remove();
					$('.video').prepend('<video src="' + $($('.video .iosvideo a')[0]).attr('href') + '" controls poster="' + $($('.video .iosvideo img')[0]).attr('src') + '" width="640" height="360">');
					$('.video .tv-video').hide();
					var t = setTimeout(function() {
						$('.video').attr('style', 'filter: none;');
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