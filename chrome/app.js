/**
 * app namespace
 */
var app = {};
app.init = function() {
	app.load.mainPage();
	app.load.popular();
	app.load.bullshit();
};

app.load = {};
app.load.mainPage = function() {
	var url = 'http://s.sme.sk/export/phone/?t=hp&muid=' + u.randomMuid(16);
	c.log(url);
	$.ajax({
		url : url,
		dataType : "xml",
		success : function(data) {
			c.log(data);
			$("#articleList .mainPage").empty();
			$(data).find("feed").each(function() {

				$(this).find("item").each(function() {
					var id = $(this).find('id').text();
					var name = $(this).find('hdg').text();
					$("#articleList .mainPage").append('<a class="link" href="#' + id + '" onClick="app.load.article(' + id + ');">' + name + '</a>');

				});
			});
		}
	});
};
app.load.popular = function() {
	var url = 'http://s.sme.sk/export/phone/?t=top&muid=' + u.randomMuid(16);
	c.log(url);
	$.ajax({
		url : url,
		dataType : "xml",
		success : function(data) {
			c.log(data);
			$("#articleList .popular").empty();
			$(data).find("feed").each(function() {
				$(this).find("items").each(function() {
					$("#articleList .popular").append('<h4>' + $(this).attr('section') + '</h4>');
					$(this).find("item").each(function() {
						var id = $(this).find('id').text();
						var name = $(this).find('hdg').text();
						$("#articleList .popular").append('<a class="link" href="#' + id + '" onClick="app.load.article(' + id + ');">' + name + '</a>');

					});
				});
			});
		}
	});

};

app.load.bullshit = function() {
	var url = 'http://s.sme.sk/export/phone/?s=koment&muid=' + u.randomMuid(16);
	c.log(url);
	$.ajax({
		url : url,
		dataType : "xml",
		success : function(data) {
			c.log(data);
			$("#articleList .bullshit").empty();
			$(data).find("feed").each(function() {
				$(this).find("items").each(function() {
					$(this).find("item").each(function() {
						var id = $(this).find('id').text();
						var name = $(this).find('hdg').text();
						c.log(this);
						$("#articleList .bullshit").append('<a class="link" href="#' + id + '" onClick="app.load.article(' + id + ');">' + name + '</a>');

					});
				});
			});
		}
	});
};
app.load.article = function(id, url) {
	$('#articleContent').fadeOut(function() {
		var url = 'http://s.sme.sk/export/phone/html/?cf=' + id;
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = handleStateChange;
		xhr.open("GET", url, true);
		xhr.send();
		function handleStateChange() {
			if(xhr.readyState == 4) {
				var data = xhr.responseText;
				data = data.replace(/<script/g, '<p class="hidden"')
				c.log(data);
				$("#articleContent").html(data);
				$('#articleContent').fadeIn();
			}
		}

	});
}
/**
 * C namespace
 */
var c = {};
c.log = function(m) {
	//console.log(m);
}
/**
 * Utils namespace
 */
var u = {};
u.randomMuid = function(length) {
	var chars = '0123456789'.split('');

	if(!length) {
		length = Math.floor(Math.random() * chars.length);
	}
	var str = '';
	for(var i = 0; i < length; i++) {
		str += chars[Math.floor(Math.random() * chars.length)];
	}
	return str;
}
$(function() {
	app.init()
});
var requestFilter = {
	urls : ["<all_urls>"]
};
//TODO: zrusit ked vyjde verzia 17.x
chrome.experimental.webRequest.onBeforeSendHeaders.addListener(function(details) {
	var headers = details.requestHeaders;
	console.log(headers);
	for(var i = 0, l = headers.length; i < l; ++i) {
		if(headers[i].name == 'User-Agent') {
			break;
		}
	}
	//if(i < headers.length) {
	headers[i].value = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/535.7 (KHTML, like Gecko) Chrome/16.0.912.75 Safari/535.7';
	//}
	return {
		requestHeaders : headers
	};
}, requestFilter, ['requestHeaders', 'blocking']);
