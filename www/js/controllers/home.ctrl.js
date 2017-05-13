angular.module('home.ctrl', [])

.controller('homeCtrl', function(ConnectivityMonitor, $cordovaToast, $cordovaDialogs, $scope, $localStorage, $ionicHistory, $ionicLoading, $timeout, $state, $ionicSideMenuDelegate, $translate){
	if(!$localStorage.userData) {
		$state.go('login');
	}
	else {
		console.log('homeCtrl');
		console.log($localStorage.languageSelected);
		$translate.use($localStorage.languageSelected);
	}
	$scope.$storage = $localStorage;
	$ionicSideMenuDelegate.canDragContent(true);
	//$localStorage.$reset();
	function expiryDateDiff(date)
	{
		var a = moment();
		var b = moment(date);
	
		return a.diff(b, 'days');
	}
	
	if($localStorage.userData != undefined && expiryDateDiff($localStorage.userData.expiration_date) > 0)
	{
		$state.go('logout');
	}
	
	$scope.logout = function(){
		$localStorage.$reset({
			defaultData	: $localStorage.defaultData,
			locations	: $localStorage.locations,
			members		: $localStorage.members
		});
		$ionicLoading.show({template: '<ion-spinner></ion-spinner>'});
		$timeout(function(){
			$ionicLoading.hide();
			$state.go('login');
		},1000);
	}

	$scope.goTo = function(where) {
		console.log("Home Links Check Internet");
		if(!ConnectivityMonitor.isOnline()) {
			//$cordovaDialogs.alert($translate.instant('ADD25'), $translate.instant('ADD26'), $translate.instant('ADD27'));
			$cordovaToast
			    .show($translate.instant('ADD25'), 'short', 'center')
			    .then(function(success) {
			    	//success
			    }, function (error) {
			     	// error
	 		});
		}
		else {
			console.log(where);
			$state.go(where);
		}
	}
	$scope.goToReports = function(where, param) {
		console.log("Home Links Check Internet");
		if(!ConnectivityMonitor.isOnline()) {
			//$cordovaDialogs.alert($translate.instant('ADD25'), $translate.instant('ADD26'), $translate.instant('ADD27'));
			$cordovaToast
			    .show($translate.instant('ADD25'), 'short', 'center')
			    .then(function(success) {
			    	//success
			    }, function (error) {
			     	// error
	 		});
		}
		else {
			console.log(where);
			console.log(param);
			var paramId = { uid: param};
			$state.go(where, paramId);
		}
	}

})

