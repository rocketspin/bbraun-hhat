angular.module('profile.ctrl', [])
.controller('profileCtrl', function($scope, $ionicScrollDelegate, $cordovaDialogs, $ionicPopup, $stateParams, $ionicLoading, $localStorage, $timeout, $state, user, observation, $translate) {
	if(!$localStorage.userData) $state.go('login');
	
	$scope.userData 		= $localStorage.userData;
	$scope.passwordChange 	= {};
	$scope.alertMessage 	= '';
	
	
	$scope.updateProfile = function()
	{
		dataParams = {};
		dataParams.userData 		= $scope.userData;
		dataParams.passwordChange 	= $scope.passwordChange;
		$scope.alertMessage = '';
		
		$ionicLoading.show({template: '<ion-spinner></ion-spinner>'});
		user.updateProfile(dataParams, function(data)
		{
			if(data.status == 1)
			{
				$ionicPopup.show({
					cssClass: 	'popup-success',
					template: 	'<i class="ion-android-checkmark-circle"></i><br/><p>'+data.message+'</p>',
					title: 		$translate.instant('R3')+'!',
					scope: 		$scope,
					buttons: [
						{
							text: $translate.instant('C11'),
							type: 'button-balanced'
						}
					]
				});
				$localStorage.userData = $scope.userData;
			}
			else
			{
				$scope.alertMessage	= '<div class="alert '+data.errortype+' icon">'+data.message+'</div>';
			}
			$ionicLoading.hide();
		});
	}
	
	$scope.syncData = function()
	{
		$ionicLoading.show({template: '<ion-spinner></ion-spinner><br>'+$translate.instant('R1'),});
		$timeout(function(){
			observation.getLocations(function(result){
				if(result.status == 1)
				{
					$localStorage.locations = result.result;
					$cordovaDialogs.alert($translate.instant('R2'), $translate.instant('R3'), $translate.instant('R4'));
				}
				
				else
					$cordovaDialogs.alert(data.message, $translate.instant('C12'), $translate.instant('C1'));
				$ionicLoading.hide();
			});
		},1000);
	}
})