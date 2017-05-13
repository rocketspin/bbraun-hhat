angular.module('contact.ctrl', [])
.controller('contactCtrl', function($scope, $state, $ionicPopup, $localStorage, $ionicScrollDelegate, $ionicLoading, $cordovaDialogs, $timeout, contact, $translate) {
	$scope.alertMessage = '';
	$scope.contact 		= {};
	$scope.$storage 	= $localStorage;
	
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
	
		
	$scope.sendMessage = function()
	{
		var c = $scope.contact;
		
		if(!c.name)
		{
			$cordovaDialogs.alert($translate.instant('C3'), $translate.instant('C2'), $translate.instant('C1'));
			return;
		}
		if(!c.contact_no)
		{
			$cordovaDialogs.alert($translate.instant('C4'), $translate.instant('C2'), $translate.instant('C1'));
			return;
		}
		if(!c.email)
		{
			$cordovaDialogs.alert($translate.instant('ADD10'), $translate.instant('C2'), $translate.instant('C1'));
			return;
		}
		if(!c.designation)
		{
			$cordovaDialogs.alert($translate.instant('C5'), $translate.instant('C2'), $translate.instant('C1'));
			return;
		}
		if(!c.department)
		{
			$cordovaDialogs.alert($translate.instant('C6'), $translate.instant('C2'), $translate.instant('C1'));
			return;
		}
		if(!c.hospital)
		{
			$cordovaDialogs.alert($translate.instant('C7'), $translate.instant('C2'), $translate.instant('C1'));
			return;
		}
		if(!c.no_of_beds)
		{
			$cordovaDialogs.alert($translate.instant('C8'), $translate.instant('C2'), $translate.instant('C1'));
			return;
		}
		if(!c.address)
		{
			$cordovaDialogs.alert($translate.instant('C9'), $translate.instant('C2'), $translate.instant('C1'));
			return;
		}
		if(!c.country)
		{
			$cordovaDialogs.alert($translate.instant('C10'), $translate.instant('C2'), $translate.instant('C1'));
			return;
		}
		
		$timeout(function(){
			$scope.alertMessage = '';
			$ionicLoading.show({template: '<ion-spinner></ion-spinner>'});
			contact.sendMessage($scope.contact, function(data){	
				$ionicLoading.hide();
				$ionicScrollDelegate.scrollTop();
				if(data.status == 1)
				{
					$scope.contact = {};
					$ionicPopup.show({
						cssClass: 	'popup-success',
						template: 	'<i class="ion-android-checkmark-circle"></i><br/><p>'+$translate.instant('ADD2')+'</p>',
						title: 		'<span class="text-balanced">Successful!</span>',
						scope: 		$scope,
						buttons: [
							{
								text: $translate.instant('C11'),
								type: 'button-balanced',
							}
						]
					});
				}
				else
				{
					$cordovaDialogs.alert(data.message, $translate.instant('C12'), $translate.instant('C1'));				
					$scope.alertMessage	= '<div class="alert '+data.errortype+' icon">'+data.message+'</div>';
				}
			});
		});
	}
})