var goToTrackPct;

$('document').ready(function() {

	$(document).foundation();

	var audio = $('audio');
	var player = audio[0];
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
		var pct = player.currentTime/player.duration;
		var newLeft = Math.round(wWidth * pct);

		progress.css('width', newLeft+'px');

		// if(updateScrub) {
		// 	scrubber.css('left', newLeft+'px');
		// }	
		
	};

	var trackPaused = function() {
		wasPlaying = false;
	};

	var playStart = function() {
		wasPlaying = true;
	};

	var playOrPause = function() {
		if(playButton.hasClass('fa-play')) {
			play();
		} else {
			pause(true);
		}
	};

	var play = function(willRestart) {
		console.log('play');
		var current = $('.current');
		var gif = current.find('x-gif')[0];
		playButton.removeClass('fa-play').addClass('fa-pause');
		gif.removeAttribute('stopped');
		current.find('track-data').addClass('playing');

		player.play();
		wasPlaying = true;		
	};

	var pause = function(reset) {
		var current = $('.current');
		var gif = current.find('x-gif')[0];
		playButton.removeClass('fa-pause').addClass('fa-play');
		gif.setAttribute('stopped', '')
		current.find('track-data').removeClass('playing');

		player.pause();
		if(reset) {
			wasPlaying = false;
		}
	}

	playButton.on('click', playOrPause);
	$('.gif-wrap').on('click', playOrPause);

	fwdButton.on('click', function() {
		var nextTrack = (currentTrack < 8) ? currentTrack + 1 : currentTrack;
		if(nextTrack !== currentTrack) {
			currentTrack = nextTrack;
			console.log('nextButton:updatePlayerState()');
			updatePlayerState();
		}
	});

	backButton.on('click', function() { 
		var nextTrack = (currentTrack > 1) ? currentTrack - 1 : currentTrack;
		if(nextTrack !== currentTrack) {
			currentTrack = nextTrack;
			console.log('backButton:updatePlayerState()');
			updatePlayerState();
		}
	});

	var goToTrack = function() {
		var toTrack = parseInt($(this).attr("data-to-track"));
		currentTrack = toTrack;
		
		if(wasPlaying) {
			pause(false);
		}
		console.log('goToTrack:updatePlayerState()');
		updatePlayerState();
	};

	$('.track-thumbs img').on('click', goToTrack);

	var updatePlayerState = function() {
		console.log('updating state');
		if(wasPlaying) {
			pause(false);
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
		audio.empty();
		audio.append ('<source src="https://api.soundcloud.com/tracks/'+sId+'/stream?client_id=1f33d1f52f43a1cf07a274370125f371" type="audio/mpeg">');
		player.load();	

		if(wasPlaying) {
		  	setTimeout(function() {
		  		play(true);
		  	},200);
		  	
		}

	};


	$('.soundcloud-link').on('click', function(e) {
		e.stopPropagation();
	});

	$(window).resize(function() {
		$.each(trackElems, function(index, track) {
			maxTrackHeight = Math.max(maxTrackHeight,$(this).height());
		});

		tracksContent.height(maxTrackHeight);
	});
	
	goToTrackPct = function(pct) {

		var time = (player.duration * pct) / 100

		player.currentTime = time;
		
	};

	audio.on('canplay', function() {
		console.log('can play');
	});

	audio.on('ended', trackEnded);
	audio.on('timeupdate', timeUpdated);
	audio.on('play', playStart);
	audio.on('pause', trackPaused);

	updatePlayerState();

	var startX;
	var moveX;
	var isTouchMoving = false;
	var trackTouchStart = function(e) {
		startX = e.originalEvent.touches[0].pageX;
		isTouchMoving = true;
	};

	var trackTouchMove = function(e) {
		moveX = parseInt(e.originalEvent.touches[0].pageX - startX);

		if(isTouchMoving && !isNaN(moveX)) {
			tracksContent.css('left', moveX + 'px');
		}
		
	};

	var trackTouchEnd = function(e) {
		isTouchMoving = false;
		startX = undefined;
		tracksContent.css('left', 0);
		if (moveX > 100) {
			console.log('trigger back');
			backButton.trigger('click');
		} else if (moveX < -100 ) {
			console.log('trigger foward')
			fwdButton.trigger('click');
		} 

		moveX = 0;
	};

	trackElems.on('touchstart', trackTouchStart);
	trackElems.on('touchmove', trackTouchMove);
	trackElems.on('touchend', trackTouchEnd);

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