/**
 * @fileOverview Nepi Jano Google Chrome extension
 * @author Miroslav Magda, http://blog.ejci.net
 * @version 0.9.6
 */

/**
 * sme.sk
 */
var sme = (function() {
	/**
	 * some utils
	 */
	var utils = {};

	/**
	 * get parameter from url (if exists)
	 */
	utils.urlParam = function(name, url) {
		url = (url) ? url : window.location.href;
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regexS = "[\\?&]" + name + "=([^&#]*)";
		var regex = new RegExp(regexS);
		var results = regex.exec(url);
		if (results === null) {
			return false;
		} else {
			return results[1];
		}
		return false;
	};

	/**
	 * Artcile ID
	 */
	utils.articleId = function() {
		var articleId = document.location.pathname.split('/')[2];
		if (parseInt(articleId, 10) == articleId) {
			return articleId;
		} else {
			return false;
		}
		return false;
	};
	/**
	 * Get video ID
	 */
	utils.videoId = function() {
		var videoId = document.location.pathname.split('/')[2];
		if (parseInt(videoId, 10) == videoId) {
			return videoId;
		} else {
			return false;
		}
		return false;
	};
	/**
	 * Init app
	 */
	var init = function() {
		//video
		if (/tv.sme.sk\//i.test(document.location)) {
			//console.log('Nepi Jano: video');
			allowVideo();
		}
		//article
		else if (/sme.sk\/c\//i.test(document.location)) {
			//console.log('Nepi Jano: article');
			allowArticle();
		}
	};
	/**
	 * Check if video is blocked.
	 * If is blocked show mobile content instead.
	 */
	var allowVideo = function() {
		try {
			//check for piano content (message)
			var isPiano = ($('.tvpiano').length != 0);
			if (isPiano) {
				//console.log('Nepi Jano: Changing content :) ');
				var articleId = utils.articleId();
				if (articleId) {
					//css3 "magic"
					$('.video').attr('style', '-webkit-transition: all 1s ease-in-out');
					$('.video').attr('style', '-webkit-filter: blur(8px);');
					//get article id from URL
					var url = 'http://s.sme.sk/export/phone/html/?vf=' + articleId;
					var xhr = new XMLHttpRequest();
					xhr.onreadystatechange = handleStateChange;
					xhr.open("GET", url, true);
					xhr.send();
					function handleStateChange() {
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
								$('.video').attr('style', '-webkit-filter: none;');
							}, 500);

						}
					}

				}
			}
		} catch(e) {
			console.error('Nepi Jano: error', e);
		}

	};
	/**
	 * Check if article is blocked.
	 * If is blocked show mobile content instead.
	 */
	var allowArticle = function() {
		try {
			//this is not pretty but who cares
			var isPiano1 = ($('#article-box #itext_content .art-perex-piano').length != 0);
			var isPiano2 = ($('#article-box #itext_content .art-nexttext-piano').length != 0);
			if (isPiano1 || isPiano2) {
				//console.log('Nepi Jano: Changing content :) ');
				var articleId = utils.articleId();
				if (articleId) {
					//css3 "magic"
					$('#article-box #itext_content').attr('style', '-webkit-transition: all 1s ease-in-out');
					$('#article-box #itext_content').attr('style', '-webkit-filter: blur(8px);');
					//get article id from URL
					var url = 'http://s.sme.sk/export/phone/html/?cf=' + articleId;
					var xhr = new XMLHttpRequest();
					xhr.onreadystatechange = handleStateChange;
					xhr.open("GET", url, true);
					xhr.send();
					function handleStateChange() {
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
								$('#article-box #itext_content').attr('style', '-webkit-filter: none;');
							}, 500);

						}
					}

				}
			}
		} catch(e) {
			console.error('Nepi Jano: error', e);
		}

	};
	return {
		init : init
	};
})();

/**
 * loader for diffrent pages
 */
//sme.sk
if (/sme.sk\//i.test(document.location)) {
	sme.init();
}
