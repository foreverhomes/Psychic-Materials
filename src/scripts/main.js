
$('document').ready(function() {

	SC.initialize({
	  client_id: '1f33d1f52f43a1cf07a274370125f371'
	});
	
	var audioPlayer;
	var playButton = $('.play-button');

	$(document).foundation();

	$('.track-data').on('click', function() {
		var parent = $(this).parent();
		$(this).toggleClass('playing');

		var el = parent.find('x-gif')[0];
		el.hasAttribute('stopped') ? el.removeAttribute('stopped') : el.setAttribute('stopped', '');

		//el.hasAttribute('stopped') ? audio.pause() : audio.play();

		SC.stream('/tracks/204661121').then(function(player){
		  audioPlayer = player;
		  audioPlayer.play();
		  playButton.removeClass('fa-play').addClass('fa-pause');
		});
	});

	playButton.on('click', function() {
		if(typeof audioPlayer === "undefined") {
			console.log('start playing track 1');
		} else {
			if($(this).hasClass('fa-play')) {
				audioPlayer.play();
				$(this).removeClass('fa-play').addClass('fa-pause');
			} else {
				audioPlayer.pause();
				$(this).removeClass('fa-pause').addClass('fa-play');
			}
		}
	});

	var audio = $('audio')[0];

	var $audio = $('audio');
	$audio.on('playing', function() {
		console.log('playing');
	});

	$audio.on('ended', function() {
		$('.current').find('.track-data').removeClass('playing');
		var el = $('.current').find('x-gif')[0];
		el.setAttribute('stopped', '');
	});

	$audio.on('timeupdate', function() {
		console.log(Math.round(audio.currentTime/audio.duration * 100));
	});

	audio.currentTime = 220;
});