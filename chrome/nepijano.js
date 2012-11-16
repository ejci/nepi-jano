console.log('Checking PIANO content...');
var isPiano1 = ($('#article-box #itext_content .art-perex-piano').length != 0);
var isPiano2 = ($('#article-box #itext_content .art-nexttext-piano').length != 0);
if (isPiano1 || isPiano2) {
	console.log('PIANO content detected...');
	console.log('Changing content :) ');
	$('#article-box #itext_content').html('Nepi Jano!');
	var url = 'http://s.sme.sk/export/phone/html/?cf=' + 6605274;
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = handleStateChange;
	xhr.open("GET", url, true);
	xhr.send();

	function handleStateChange() {
		if (xhr.readyState == 4) {
			var data = xhr.responseText;
			data = data.replace(/<script/g, '<!--script');
			data = data.replace(/<\/script/g, '</script--');
			$('#article-box #itext_content').append(data);
			$('#article-box #itext_content h1').hide();
			$('#article-box #itext_content .discus').hide();
			$('#article-box #itext_content link').remove();
			$('#article-box #itext_content style').remove();
		}
	}

}

