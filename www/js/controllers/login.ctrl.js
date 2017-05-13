angular.module('login.ctrl', [])
.controller('loginCtrl', function(ConnectivityMonitor, $cordovaToast, $scope, $stateParams, $cordovaNetwork, $ionicPopup, $ionicScrollDelegate, $ionicLoading, $cordovaDialogs, $localStorage, $timeout, $state, $cookies, user, $translate){

	$scope.user 		= {};
	$scope.alertMessage = '';
	if($localStorage.languageSelected === undefined) {
		$scope.mySelect = "en";
	}
	else {
		$scope.mySelect = $localStorage.languageSelected;
	}

	$translate.use($scope.mySelect);

	if($localStorage.defaultData == undefined) 	$state.go('intro');
	if($localStorage.userData != undefined) 	$state.go('app.home');

	$scope.ChangeLanguage = function(lang){
		console.log(lang);
		$localStorage.languageSelected = lang;
		console.log($localStorage.languageSelected);
		$translate.use(lang);
	}

	$scope.login = function()
	{
		console.log("Login Check Internet");
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
			if($scope.user == undefined)
			{
				$cordovaDialogs.alert($translate.instant('E1'), $translate.instant('AG32'), $translate.instant('AG33'));
				return;
			}

			if($scope.user.email == undefined || $scope.user.email == '')
			{
				// $cordovaDialogs.alert('Enter email address.', $translate.instant('AG32'), $translate.instant('AG33'));
				//return;
			    $cordovaDialogs.alert($translate.instant('E2'), $translate.instant('AG32'), $translate.instant('AG33'));
			    return;
			}

			if($scope.user.password == undefined || $scope.user.password == '')
			{
				$cordovaDialogs.alert($translate.instant('E3'), $translate.instant('AG32'), $translate.instant('AG33'));
				return;
			}

			$ionicLoading.show({template: '<ion-spinner></ion-spinner>'});
			user.login($scope.user, function(data)
			{
				$scope.alertMessage = '';
				if(data.status == 1){

					if($localStorage.defaultData == undefined)
					{
						$localStorage.defaultData = {
						statistics:{
								companyRecords	: 0,
								accountRecords	: 0
							},
						}
					}
					//save language
					$scope.languageSelected = $localStorage.languageSelected;

					$localStorage.$reset({
						defaultData	: $localStorage.defaultData,
						userData	: data.result.user,
						locations	: data.result.location,
						token		: data.result.user.token
					});
					//save language
					$localStorage.languageSelected = $scope.languageSelected;

					var expireDate = new Date();
					expireDate.setDate(expireDate.getDate() + 14);
					// Setting a cookie
					$cookies.put('UID', data.result.user.id, {'expires': expireDate});

					$localStorage.expiration = moment().unix() + 1200000;

					// if(data.result.user.group_id == 3)
					// {
					 	$localStorage.members = data.result.members;
					// }

					//Store the data into local storage
					$timeout(function(){
						$ionicLoading.hide();
						$state.go('terms');
					},1000);
				}
				else
				{
					$ionicLoading.hide();
					$scope.alertMessage	= '<div class="alert '+data.errortype+' icon">'+data.message+'</div>';
				}
			});
		}
	}


	$scope.resetPassword = function()
	{
		$timeout(function(){

			if($scope.user == undefined)
			{
				$cordovaDialogs.alert($translate.instant('E2'), $translate.instant('AG32'), $translate.instant('AG33'));
				return;
			}

			if($scope.user.email == undefined || $scope.user.email == '')
			{
				$cordovaDialogs.alert($translate.instant('E2'), $translate.instant('AG32'), $translate.instant('AG33'));
				return;
			}

			$scope.loginError 	= '';
			$scope.loginSuccess = '';
			$ionicLoading.show({template: '<ion-spinner></ion-spinner>'});
			user.resetPassword($scope.user, function(data)
			{
				if(data.status == 1)
				{
					$ionicPopup.show({
						cssClass: 	'popup-success',
						template: 	'<i class="ion-android-checkmark-circle"></i><br/><p>'+data.message+'</p>',
						title: 		'<span class="text-balanced">Successful!</span>',
						scope: 		$scope,
						buttons: [
							{
								text: 'Clean Hands Save Lives',
								type: 'button-balanced',
							}
						]
					});
				}
				else
				{
					$scope.alertMessage	= '<div class="alert '+data.errortype+' icon">'+data.message+'</div>';
				}
				$ionicLoading.hide();
			});
		});
	}
})
