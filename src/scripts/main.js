var goToTrackPct;

$('document').ready(function() {

	$(document).foundation();

	SC.initialize({
	  client_id: '1f33d1f52f43a1cf07a274370125f371'
	});

	var audioPlayer;
	var currentTrack = 1;
	var startX;
	var updateScrub = true;

	var playButton = $('.play-button');
	var fwdButton = $('.fwd-button');
	var backButton = $('.back-button');
	var tracksContent = $('#tracks-content');
	var progress = $('.progress');
	var scrubber = $('.scrubber');
	var tracks = [];

	var wasPlaying = false;

	// construct tracks array from .track nodes
	var trackElems = $('.track');
	var maxTrackHeight = 0;
	$.each(trackElems, function(index, track) {

		var newTrack = {
			title: $(track).attr("data-title"),
			sId: $(track).attr("data-sc-id")
		};

		tracks.push(newTrack);

		$(this).find('.soundcloud-link').attr("href", $(track).attr("data-share-url"));
		$(this).find('.track-data-items h3').text(newTrack.title);

		maxTrackHeight = Math.max(maxTrackHeight,$(this).height());
	});

	tracksContent.height(maxTrackHeight);

	var trackEnded = function() {
		if(currentTrack < 8) {
			wasPlaying = true;
			fwdButton.trigger('click');
		}
	};

	var timeUpdated = function() {
		var wWidth = $(window).width();
		var currentTime = audioPlayer.currentTime();
		var pct = currentTime/audioPlayer.streamInfo.duration;
		var newLeft = Math.round(wWidth * pct);

		progress.css('width', newLeft+'px');

		// if(updateScrub) {
		// 	scrubber.css('left', newLeft+'px');
		// }	
		
	};

	var playStart = function() {
		wasPlaying = true;
	};

	var playOrPause = function() {

		

		if(typeof audioPlayer !== "undefined") {

			

			if(playButton.hasClass('fa-play')) {
				play();
			} else {
				pause();
			}
		} 
	};

	var play = function() {
		console.log('play');
		var current = $('.current');
		var gif = current.find('x-gif')[0];
		audioPlayer.play();
		wasPlaying = true;
		playButton.removeClass('fa-play').addClass('fa-pause');
		gif.removeAttribute('stopped');
		current.find('track-data').addClass('playing');
	};

	var pause = function() {
		var current = $('.current');
		var gif = current.find('x-gif')[0];
		audioPlayer.pause();
		wasPlaying = false;
		playButton.removeClass('fa-pause').addClass('fa-play');
		gif.setAttribute('stopped', '')
		current.find('track-data').removeClass('playing');
	}

	playButton.on('click', playOrPause);
	$('.gif-wrap').on('click', playOrPause);

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

	var goToTrack = function() {
		var toTrack = parseInt($(this).attr("data-to-track"));
		currentTrack = toTrack;
		updatePlayerState();
	};

	$('.track-thumbs img').on('click', goToTrack);

	var updatePlayerState = function() {
		console.log('updating state');
		if(typeof audioPlayer !== "undefined" && audioPlayer._isPlaying) {
			playOrPause();
			wasPlaying = true;
		}

		backButton.toggleClass('disabled', currentTrack === 1);
		fwdButton.toggleClass('disabled', currentTrack === 8);
		tracksContent.removeClass().addClass('track-'+currentTrack);

		//update current .track node
		$('.track.current').removeClass('current');
		var newTrack = $('.track:nth-child('+currentTrack+')');
		newTrack.addClass('current');

		$('.track-thumbs img').removeClass('current');
		$('.track-thumbs img:nth-child('+currentTrack+')').addClass('current');

		//update current song title
		$('.current-track-title').text(tracks[currentTrack-1].title);

		progress.css('width', 0);

		var sId = tracks[currentTrack-1].sId;
		SC.stream('/tracks/'+sId).then(function(player){
		  

		  audioPlayer = player;

		  if(wasPlaying) {
		  	setTimeout(function() {
		  		play();
		  	},200);
		  	
		  }

		  audioPlayer.on('finish', trackEnded);
		  audioPlayer.on('time', timeUpdated);
		  audioPlayer.on('play-resume', playStart);
		  audioPlayer.on('pause', paused);

		  
		  
		});
	};

	var test = function() {
		console.log('wasPlaying', wasPlaying);
	}

	$('.soundcloud-link').on('click', function(e) {
		e.stopPropagation();
	});

	$(window).resize(function() {
		$.each(trackElems, function(index, track) {
			maxTrackHeight = Math.max(maxTrackHeight,$(this).height());
		});

		tracksContent.height(maxTrackHeight);
	});

	updatePlayerState();
	
	goToTrackPct = function(pct) {
		if(typeof audioPlayer !== "undefined") {

			var time = (audioPlayer.streamInfo.duration * pct) / 100

			audioPlayer.seek(time);
		}
	};

	// var scrubTouchStart = function(e) {
	// 	console.log(e);
	// 	startX = e.pageX;
	// 	updateScrub=false;
	// };

	// var scrubTouchMove = function(e) {
	// 	console.log('moving');
	// 	if(!updateScrub) {
	// 		var moveX = e.pageX;
	// 		scrubber.css('left', moveX+'px');
	// 	}
	// };

	// var scrubTouchEnd = function(e) {
	// 	updateScrub = true;
	// };

	// scrubber.on('touchstart mousedown', scrubTouchStart);
	// scrubber.on('touchmove mousemove', scrubTouchMove);
	// scrubber.on('touchend mouseup', scrubTouchEnd)

});