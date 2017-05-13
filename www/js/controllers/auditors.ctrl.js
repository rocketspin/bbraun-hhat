angular.module('auditors.ctrl', [])

.controller('auditorsCtrl', function($scope, $state, $rootScope, $ionicLoading, $localStorage, $cordovaDialogs, $cordovaNetwork, user, $translate){
	if(!$localStorage.userData) $state.go('login');
	$scope.$storage 	= $localStorage;
	$scope.networkState	= 1;
	$scope.auditors		= Array();
	
	document.addEventListener("deviceready", function () {
		$rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
			$scope.networkState = 0;
		})
		// listen for Online event
		$rootScope.$on('$cordovaNetwork:online', function(event, networkState){
			$scope.networkState = 1;
		});
	});

	/*$ionicLoading.show({template: '<ion-spinner></ion-spinner>'});
	user.getCompanyUsers(function(data){
		if(data.status)
		{
			$scope.auditors = data.result;
		}
		else
			$cordovaDialogs.alert(data.message, 'API Server Error', 'OK');
		
		$ionicLoading.hide();
	});*/
})