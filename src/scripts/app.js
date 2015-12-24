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
          

        // window.addEventListener('resize', function () {
        //   [].forEach.call(document.querySelectorAll('x-gif'), function (elem) {
        //     elem.relayout();
        //   });
        // })

 
  	//}
  }).controller('pmCtrl', function ($scope) {
  	console.log('hey bud')

  	

  });
