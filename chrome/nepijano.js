/**
 * @fileOverview Nepi Jano Google Chrome extension
 * @author Miroslav Magda, http://blog.ejci.net
 * @version 0.9.5
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
    }
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
    }
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
                            //$('#article-box #itext_content').empty();
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
                                $('#article-box #itext_content').attr('style', '-webkit-filter: blur(0px);');
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
    }
})();

/**
 * hnonline.sk
 */
var hn = (function() {
    var init = function() {
        try {
            //check for piano
            var isPiano = ($('#body_inhalt .piano-locked-article-top').length != 0);
            if (isPiano) {
                var feed = false;
                //titulka
                if (/hnonline.sk\/c1/i.test(document.location)) {
                    feed = 'https://apiserver.hnonline.sk/content/fallback/xml/list/titulka/';
                }
                //ekonomika
                if (/hnonline.sk\/ekonomika\//i.test(document.location)) {
                    feed = 'https://apiserver.hnonline.sk/content/fallback/xml/list/ekonomika-a-firmy/';
                }
                //slovensko
                if (/hnonline.sk\/slovensko\//i.test(document.location)) {
                    feed = 'https://apiserver.hnonline.sk/content/fallback/xml/list/slovensko/';
                }
                //svet
                if (/hnonline.sk\/svet\//i.test(document.location)) {
                    feed = 'https://apiserver.hnonline.sk/content/fallback/xml/list/svet/';
                }
                //nazory
                if (/hnonline.sk\/nazory\//i.test(document.location)) {
                    feed = 'https://apiserver.hnonline.sk/content/fallback/xml/list/nazory-a-analyzy/';
                }
                //sport
                if (/hnonline.sk\/sport\//i.test(document.location)) {
                    feed = 'https://apiserver.hnonline.sk/content/fallback/xml/list/sport/';
                }
                //get article id from url
                var articleId = false;
                articleId = ((''+document.location).split('-')[1]);
                if (feed && articleId) {
                    allowArticle(articleId, feed);
                }
            }
        } catch(e) {
            console.error('Nepi Jano: error', e);
        }
    };
    var allowArticle = function(articleId, feed) {
        $('#body_inhalt .detail-text').attr('style', '-webkit-transition: all 1s ease-in-out');
        $('#body_inhalt .detail-text').attr('style', '-webkit-filter: blur(8px);');
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = handleStateChange;
        xhr.open("GET", feed, true);
        xhr.send();
        function handleStateChange() {
            if (xhr.readyState === 4) {
                try {
                    var xml = $.parseXML(xhr.responseText);
                    var $xml = $(xml)
                    //sollution from 2013.05.16 was fixed by hnonline.sk developers
                    /*
                    var article = $xml.find('article[id="' + articleId + '"] body');
                    console.log(article)
                    //if exists then replace piano content...
                    if (article.length > 0) {
                    $('#body_inhalt .detail-text').html($('<div/>').html(article).text());
                    }
                    */
                    //sollution from 2013.05.19 was fixed by hnonline.sk developers
                    /*$xml.find('article').each(function() {
                        var url = $(this).find('url').text();
                        if (url.split('-')[1] == (''+document.location).split('-')[1]) {
                            $('#body_inhalt .detail-text').html($('<div/>').html($(this).find('body')).text());
                        }
                    });*/
                    //new sollution :)
                    //hint to hnonline.sk developers: use oAuth ;) 
                    var titleWeb=$('#body_inhalt h1').text();
                    $xml.find('article').each(function() {
                        var titleXml = $(this).find('title').text();
                        if ($.trim(titleXml)===$.trim(titleWeb)) {
                            $('#body_inhalt .detail-text').html($('<div/>').html($(this).find('body')).text());
                        }
                    })
                } catch(e) {
                    console.error('Nepi Jano: error', e);
                }
                var t = setTimeout(function() {
                    $('#body_inhalt .detail-text').attr('style', '-webkit-filter: blur(0px);');
                }, 500);
            }
        }

    }
    return {
        init : init
    }
})();

/**
 * etrend.sk
 */
var etrend = (function() {
    var init = function() {
        try {
            //check for piano
            var isPiano = ($('#article_detail .piano-box').length != 0);
            var isPaid = ($('#article_detail .active_box .boxes').length != 0);
            if (isPiano || isPaid) {
                var articleId = false;
                articleId = $($('#article_detail .title div')[0]).text();
                if (articleId) {
                    allowArticle(articleId);
                }

            }
        } catch(e) {
            console.error('Nepi Jano: error', e);
        }
    };
    var allowArticle = function(articleId) {
        function createUUID() {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 40; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            var uuid = s.join("");
            return uuid;
        }


        $('#article_text').attr('style', '-webkit-transition: all 1s ease-in-out');
        $('#article_text').attr('style', '-webkit-filter: blur(8px);');
        var url = 'http://www.etrend.sk/services/IphoneAppDict.html?deviceType=1&device=' + createUUID() + '&quality=hi&queryType=articleDetail&uid=' + articleId;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = handleStateChange;
        xhr.open("GET", url, true);
        xhr.send();
        function handleStateChange() {
            if (xhr.readyState === 4) {
                try {
                    var xml = $.parseXML(xhr.responseText);
                    var $xml = $(xml)
                    var article = $xml.find('string');
                    //if exists then replace piano content...
                    if (article.length > 0) {
                        $('#article_text').html($('<div/>').html(article).text());
                    }
                } catch(e) {
                    console.error('Nepi Jano: error', e);
                }
                var t = setTimeout(function() {
                    $('#article_text').attr('style', '-webkit-filter: blur(0px);');
                }, 500);
            }
        }

    }
    return {
        init : init
    }
})();

/**
 * loader for diffrent pages
 */
//sme.sk
if (/sme.sk\//i.test(document.location)) {
    sme.init();
}
//hnonline.sk
if (/hnonline.sk\//i.test(document.location)) {
    hn.init();
}
//etrend.sk
if (/etrend.sk\//i.test(document.location)) {
    etrend.init();
}
