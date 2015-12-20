'use strict';

angular.module('pm', ['x-gif'])
  .config(function () {
    // $stateProvider
    //   .state('home', {
    //     url: '/',
    //     controller: 'MainCtrl'
    //   });

    // $urlRouterProvider.otherwise('/');
  })
  .run(function ($timeout, $rootScope, $sce, $http) {
  		console.log('running')
        var xGif = document.querySelector('x-gif'),
          audio = document.querySelector('audio'),
          metadata;

        $http.get('audio/palms_lose.json', function(data) {
        	console.log(data);
        	//metadata = JSON.parse(this.response);
          	//setupAudioSynching(audio, xGif, metadata);
          	//audio.play();
        })
          

        // window.addEventListener('resize', function () {
        //   [].forEach.call(document.querySelectorAll('x-gif'), function (elem) {
        //     elem.relayout();
        //   });
        // })

  	var setupAudioSynching = function (audio, xGifs, metadata) {
  	  var synchOffset = -0.1;

  	  audio.addEventListener('playing', function () {
  	    var beats = metadata.response.track.analysis.beats,
  	      beatIndex = 0;
  	    while (beats[0].start > 0) {
  	      beats.unshift({
  	        start: beats[0].start - beats[0].duration,
  	        duration: beats[0].duration,
  	        confidence: 0
  	      })
  	    }

  	    var animationLoop = function () {
  	      requestAnimationFrame(animationLoop);

  	      if (beats.length > beatIndex) {
  	        var currentTime = audio.currentTime + synchOffset;
  	        while (beatIndex < beats.length && currentTime > beats[beatIndex].start) {
  	          beatIndex++;
  	        }
  	        var beat = beats[beatIndex - 1];

  	        var sinceLastBeat = currentTime - beat.start,
  	          beatFraction = sinceLastBeat / beat.duration;
  	        [].forEach.call(xGifs, function (xGif) {
  	          xGif.clock(beatIndex, beat.duration * 1000 / audio.playbackRate, beatFraction);
  	        })
  	      }
  	    }
  	    animationLoop();
  	  });
  	}
  }).controller('pmCtrl', function ($scope) {
  	console.log('hey bud')

  	

  });
