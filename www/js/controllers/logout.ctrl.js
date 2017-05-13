angular.module('logout.ctrl', [])
.controller('logoutCtrl', function($scope, $stateParams, $ionicLoading, $localStorage, $timeout, $state, user, $translate){
	
	//save language
	$scope.languageSelected = $localStorage.languageSelected;
	
	$localStorage.$reset({
		defaultData	: $localStorage.defaultData,
		locations	: $localStorage.locations,
		members		: $localStorage.members
	});
	//save language
	$localStorage.languageSelected = $scope.languageSelected;

	$ionicLoading.show({template: '<ion-spinner></ion-spinner>'});
	$timeout(function(){
		$ionicLoading.hide();
		$state.go('login');
	},50);
})