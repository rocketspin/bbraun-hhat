angular.module('player.ctrl', [])

.controller('playerCtrl', function($scope, $rootScope, $state, $stateParams, $localStorage, $ionicPopup, $sce, $timeout, $cordovaInAppBrowser, $translate, $cordovaToast){
	if(!$localStorage.userData) $state.go('login');
	$scope.params = $stateParams;
	
	$rootScope.$on('$cordovaInAppBrowser:exit', function(e, event){
		//$scope.moment = '';
	})
	
	$scope.visitWebsite = function(link, moment)
	{
		var options = {
			location	: 'no',
			clearcache	: 'yes',
			toolbar		: 'yes'
		};

		$scope.moment = moment;	
		// document.addEventListener("deviceready", function () {
			
		// 	$timeout(function(){
		// 		$cordovaInAppBrowser.open(link, '_blank', options);
		// 	},200);
			
		// }, false);

		document.addEventListener("deviceready", function () {
		    $cordovaInAppBrowser.open(link, '_blank', options)
		      .then(function(event) {
		        // success
		      })
		      .catch(function(event) {
		        // error
		        $cordovaToast
				    .show($translate.instant('ADD31'), 'long', 'center')
				    .then(function(success) {
				    	$cordovaInAppBrowser.close();
				    	$state.go('app.home');
				    	//if(typeof callback == 'function') callback(data);
				    }, function (error) {
				     	// error
		 		});	
		      });


			  //$cordovaInAppBrowser.close();
	  	}, false);

	  	$rootScope.$on('$cordovaInAppBrowser:loaderror', function(e, event){
	  		$cordovaToast
			    .show($translate.instant('ADD31'), 'long', 'center')
			    .then(function(success) {
				    $cordovaInAppBrowser.close();
			    	$state.go('app.home');
			    	//if(typeof callback == 'function') callback(data);
			    }, function (error) {
			     	// error
	 		});
  		});

	}
})