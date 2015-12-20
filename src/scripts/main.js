
$('document').ready(function() {
	$(document).foundation();

	$('.track-data').on('click', function() {
		var parent = $(this).parent();
		$(this).toggleClass('playing');

		var el = parent.find('x-gif')[0];
		el.hasAttribute('stopped') ? el.removeAttribute('stopped') : el.setAttribute('stopped', '');

		var audio = parent.find('audio')[0];
		el.hasAttribute('stopped') ? audio.pause() : audio.play();
	});
});