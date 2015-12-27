
$('document').ready(function() {

	$(document).foundation();

	SC.initialize({
	  client_id: '1f33d1f52f43a1cf07a274370125f371'
	});

	var audioPlayer;
	var currentTrack = 1;

	var playButton = $('.play-button');
	var fwdButton = $('.fwd-button');
	var backButton = $('.back-button');
	var tracksContent = $('#tracks-content');
	var tracks = [];

	// construct tracks array from .track nodes
	$.each($('.track'), function(index, track) {
		var newTrack = {
			title: $(track).attr("data-title"),
			sId: $(track).attr("data-sc-id")
		}
		tracks.push(newTrack);

		$(this).find('.soundcloud-link').attr("src", $(track).attr("data-share-url"))
	});

	var trackEnded = function() {
		console.log('track ended');
	};

	var timeUpdated = function(thing, stuff) {
		var currentTime = audioPlayer.currentTime();
		console.log(Math.round(currentTime/audioPlayer.streamInfo.duration * 100))
	};

	var playStart = function() {
		console.log('started playing');
	};

	var paused = function() {
		console.log('paused');
	};

	var playOrPause = function() {

		var current = $('.current');

		if(typeof audioPlayer !== "undefined") {

			var gif = current.find('x-gif')[0];

			if(playButton.hasClass('fa-play')) {
				audioPlayer.play();
				playButton.removeClass('fa-play').addClass('fa-pause');
				gif.removeAttribute('stopped');
				current.find('track-data').addClass('playing');

			} else {
				audioPlayer.pause();
				playButton.removeClass('fa-pause').addClass('fa-play');
				gif.setAttribute('stopped', '')
				current.find('track-data').removeClass('playing');
			}
		} 
	};

	playButton.on('click', playOrPause);
	$('.track-data').on('click', playOrPause);

	fwdButton.on('click', function() {
		var nextTrack = (currentTrack < 8) ? currentTrack + 1 : currentTrack;
		if(nextTrack !== currentTrack) {
			currentTrack = nextTrack;
			updatePlayerState();
		}
	});

	backButton.on('click', function() { 
		var nextTrack = (currentTrack > 1) ? currentTrack - 1 : currentTrack;
		if(nextTrack !== currentTrack) {
			currentTrack = nextTrack;
			updatePlayerState();
		}
	});

	var updatePlayerState = function() {

		if(typeof audioPlayer !== "undefined" && audioPlayer._isPlaying) {
			playOrPause();
		}

		backButton.toggleClass('disabled', currentTrack === 1);
		fwdButton.toggleClass('disabled', currentTrack === 8);
		tracksContent.removeClass().addClass('track-'+currentTrack);

		//update current .track node
		var oldTrack = $('.track.current');
		oldTrack.removeClass('current');
		var newTrack = $('.track:nth-child('+currentTrack+')');
		newTrack.addClass('current');

		//update current song title
		$('.current-track-title').text(tracks[currentTrack-1].title);

		var sId = tracks[currentTrack-1].sId;
		SC.stream('/tracks/'+sId).then(function(player){
		  audioPlayer = player;
		  audioPlayer.on('finish', trackEnded);
		  audioPlayer.on('time', timeUpdated);
		  audioPlayer.on('play-resume', playStart);
		  audioPlayer.on('pause', paused);
		});
	};

	updatePlayerState();
	// audio.on('timeupdate', function() {
	// 	console.log(Math.round(audio.currentTime/audio.duration * 100));
	// });

});