/**
 * @fileOverview Nepi Jano Google Chrome extension
 * @author Miroslav Magda, http://blog.ejci.net
 * @version 0.9.8
 */

/**
 * moved from sme to be accessible from message handler
 */
function urlParam(name, url) {
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
 * returns message from global.html
 * injected scripts are blocked from cross domain calls
 * @author Jakub Zitny <jakub.zitny@gmail.com>
 * @since Mon Mar 17 00:35:36 HKT 2014
 */
function getAnswer(theMessageEvent) {
	if (theMessageEvent.name === "article") {
		data = theMessageEvent.message;
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

	}
}

safari.self.addEventListener("message", getAnswer, false);

/**
 * sme.sk
 */

var sme = (function() {
	/**
	 * some utils
	 */
	var utils = {};

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
			//quick fix for changes at sme 16.05.2014
			var isPiano3 = ($('#article-box div[id^=pianoArticle]').length != 0);
			if (isPiano1 || isPiano2 || isPiano3) {
				//console.log('Nepi Jano: Changing content :) ');
				var articleId = utils.articleId();
				if (articleId) {
					//get article id from URL
					var url = 'http://s.sme.sk/export/phone/html/?cf=' + articleId;
					safari.self.tab.dispatchMessage("doXhr", url);
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
 * handles requests to Video secion of tyzden.sk
 *
 * @author Jakub Zitny <jakub.zitny@gmail.com>
 * @since Fri Mar 21 04:46:55 HKT 2014
 */
var tyzden = (function() {

    this.init = function() {
        allowArticle();
    };

    /**
     * prepares the video html
     */
    var buildPlayerDiv = function(videoUrl, thumbUrl) {
        var playerDiv = ''+
          '<div class="player" style="margin: 9px 0">'+
            '<div id="mep_0" class="mejs-container svg mejs-video" style="width: 640px; height: 360px;">'+
              '<div class="mejs-inner">'+
                '<div class="mejs-mediaelement">'+
                  '<video width="640" height="360" poster="'+thumbUrl+'" id="video-player" style="max-width: 100%; width: 100%; height: 100%;" preload="true" src="'+videoUrl+'" controls autoplay>'+
                    '<source type="video/mp4" src="'+videoUrl+'">'+
                    '<source type="video/webm" src="'+videoUrl.replace("mp4","webm")+'">'+
                  '</video>'+
                '</div>'+
                /* TODO get this mejs to play the video
                '<div class="mejs-layers">'+
                  '<div class="mejs-poster mejs-layer" style="background-image: url('+thumbUrl+'); width: 100%; height: 100%; display: none;">'+
                    '<img width="100%" height="100%" src="'+thumbUrl+'">'+
                  '</div>'+
                  '<div class="mejs-overlay mejs-layer" style="width: 100%; height: 100%; display: none;">'+
                    '<div class="mejs-overlay-loading"><span></span>'+
                    '</div>'+
                  '</div>'+
                  '<div class="mejs-overlay mejs-layer" style="display: none; width: 100%; height: 100%;">'+
                    '<div class="mejs-overlay-error"></div></div>'+
                  '<div class="mejs-overlay mejs-layer mejs-overlay-play" style="width: 100%; height: 330px; display: block;">'+
                    '<div class="mejs-overlay-button" style="margin-top: -5px;"></div>'+
                  '</div>'+
                '</div>'+
                '<div class="mejs-controls" style="display: block; visibility: hidden;">'+
                  '<div class="mejs-button mejs-playpause-button mejs-pause">'+
                    '<button type="button" aria-controls="mep_0" title="Play/Pause" aria-label="Play/Pause"></button>'+
                  '</div>'+
                  '<div class="mejs-time-rail" style="width: 490px;">'+
                    '<span class="mejs-time-total" style="width: 480px;">'+
                      '<span class="mejs-time-buffering" style="display: none;"></span>'+
                      '<span class="mejs-time-loaded" style="width: 480px;"></span>'+
                      '<span class="mejs-time-current" style="width: 0px;"></span>'+
                      '<span class="mejs-time-handle" style="left: -7px;"></span>'+
                      '<span class="mejs-time-float" style="display: none; left: 120px;">'+
                        '<span class="mejs-time-float-current">00:00</span>'+
                        '<span class="mejs-time-float-corner"></span>'+
                      '</span>'+
                    '</span>'+
                  '</div>'+
                  '<div class="mejs-time">'+
                    '<span class="mejs-currenttime">00:00</span>'+
                    '<span> / </span>'+
                    //'<span class="mejs-duration">09:13</span>'+
                  '</div>'+
                  '<div class="mejs-button mejs-volume-button mejs-mute">'+
                    '<button type="button" aria-controls="mep_0" title="Mute Toggle" aria-label="Mute Toggle"></button>'+
                    '<div class="mejs-volume-slider" style="display: none;">'+
                      '<div class="mejs-volume-total"></div>'+
                      '<div class="mejs-volume-current" style="height: 80px; top: 28px;"></div>'+
                      '<div class="mejs-volume-handle" style="top: 25px;"></div>'+
                    '</div>'+
                  '</div>'+
                  '<div class="mejs-button mejs-fullscreen-button">'+
                    '<button type="button" aria-controls="mep_0" title="Fullscreen" aria-label="Fullscreen"></button>'+
                  '</div>'+
                '</div>'+
                '<div class="mejs-clear"></div>'+
                */
              '</div>'+
            '</div>'+
          '</div>';
        return playerDiv;
    };

    /**
     * if pianobox then replace pianobox with
     * built videoplayer generated from og:video and og:image links
     * <moral>.. really? opengraph broke the pianowall</moral>
     * todo fix mejs to replace the native player controls
     */
    var allowArticle = function() {
        try {
          var pianobox = $('div.video-primary article div.pianobox');
          if (pianobox.length == 0) {
            return 0;
          }
          // the magic (yes it's that easy)
          var videoUrl = $('meta[property="og:video"]').attr('content');
          var thumbUrl = $('meta[property="og:image"]').attr('content');
          pianobox.replaceWith(buildPlayerDiv(videoUrl, thumbUrl));
		    } catch(e) {
          console.error('Nepi Jano: error', e);
		    }

    };
	return {
		init : init
	};
})();

/**
 * handles requests to foreignpolicy.com
 * @author Jakub Zitny <jakub.zitny@gmail.com>
 * @since Tue Sep  2 23:18:35 CEST 2014
 */
var fp = (function() {

    this.refreshIntervalId = null;

    this.init = function() {
        if (/articles/i.test(document.location) || /posts/i.test(document.location)) {
          this.refreshIntervalId = setInterval(function() { checkOverLay(); }, 5000);
        }
    };

    /**
     * check if fp paywall did its job
     */
    var checkOverLay = function() {
      if ($('#TB_window').length) {
        clearInterval(this.refreshIntervalId);
        allowArticle();
      };
    };

    /**
     * remove the overlays
     * make it scrollable
     * TODO: fix the next articles after scrolling down
     */
    var allowArticle = function() {
        try {
          // the magic (yes it's that easy again)
          $('#TB_overlay').remove();
          $('#TB_window').remove();
          $('body').removeClass('overlay-no-scroll');
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

// tyzden.sk
if (/tyzden.sk\//i.test(document.location)) {
  tyzden.init();
}

// foreignpolicy.com
if (/foreignpolicy.com\//i.test(document.location)) {
  fp.init();
}
