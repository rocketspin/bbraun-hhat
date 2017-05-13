angular.module('intro.ctrl', [])
.controller('introCtrl', function($scope, $state, $ionicLoading, $timeout, $localStorage, $translate)
{
	$scope.$storage = $localStorage;
	if($localStorage.defaultData != undefined && $localStorage.userData == undefined) 	$state.go('login');
	if($localStorage.userData != undefined && $state.current.name == 'intro') 			$state.go('app.home');
	$scope.currentState = $state.current.name;
	
	$scope.startApp = function()
	{
		$localStorage.defaultData = {
			statistics:{
				companyRecords	: 0,
				accountRecords	: 0
			},
		}
	
		$ionicLoading.show({template: '<ion-spinner></ion-spinner>'});
		$timeout(function(){
			$ionicLoading.hide();
			$state.go('login');
		},1000)
	};
})