angular.module('observe.ctrl', ['ionic'])

.controller('observeCtrl', function(ConnectivityMonitor, $cordovaToast, $scope, $stateParams, $ionicModal, $ionicPopup, $cordovaNetwork, $ionicHistory, $ionicLoading, $ionicListDelegate, $ionicSideMenuDelegate, $cordovaDialogs, $stateParams, $cordovaDatePicker, $localStorage, $timeout, $state, $cordovaNetwork, $interval, $q, observation, sqlite, $translate){
	if(!$localStorage.userData) $state.go('login');
	$scope.observation 	= !$localStorage.observation ? {} : $localStorage.observation;

	if($state.current.name == 'app.record1')
	{
		$localStorage.observation 	= {};
		$scope.observation			= {};
	}

	$scope.memberCount = [];

	$scope.observation.location = $scope.observation.location == undefined ? {} : $scope.observation.location;
	$scope.patientType 			= $scope.observation.location.levelOne == 	$translate.instant('ADD3') ? $translate.instant('ADD5') : $translate.instant('ADD5');
	$scope.patient				= [$translate.instant('ADD3'), $translate.instant('ADD4')];
	
	if(!$scope.observation.summary)
	{
		$scope.observation.summary			 		= {};
		$scope.observation.summary.serverDataCount 	= 0;
		$scope.observation.summary.localDataCount 	= 0;
		$scope.observation.summary.data				= {};
	}
	
	

	//language check - record frontend button classes
	if($localStorage.languageSelected === "in") {
		$scope.smallFonts = true;
	}
	else {
		$scope.smallFonts = false;
	}
	
	$ionicModal.fromTemplateUrl('templates/observation-summary.html', {
		scope: $scope,
		backdropClickToClose: false,
		hardwareBackButtonClose: false,
	}).then(function(modal) {
		$scope.modalSummary = modal;
	});
	
	$ionicModal.fromTemplateUrl('templates/additional-info.html', {
		scope: $scope,
		backdropClickToClose: false,
		hardwareBackButtonClose: false,
	}).then(function(modal) {
		$scope.modalInfo = modal;
	});
	
	
	$ionicModal.fromTemplateUrl('templates/hcw-info.html', {
		scope: $scope,
		backdropClickToClose: false,
		hardwareBackButtonClose: false,
	}).then(function(modal) {
		$scope.modalHcwInfo = modal;
	});

	$scope.hideSummary = function(url){

		if(url == 'home')
		{
			$scope.modalSummary.hide();
		    $timeout(function(){$state.go('app.home');},100);

		 //    $cordovaDialogs.confirm($translate.instant('ADD9'), $translate.instant('AG15'), [$translate.instant('AG17'), $translate.instant('AG16')])
			// .then(function(buttonIndex) {
				
			// 	if(buttonIndex != 2) return;
			// 	else {
			// 		$scope.modalSummary.hide();
		 //    		$timeout(function(){$state.go('app.home');},100);
			// 	}
			// });
			
		}
		else if(url == 'record')
		{
			$scope.modalSummary.hide();
			$timeout(function(){$state.go('app.record1', {"type":$scope.observation.type});},100);
		}
		else {
			$scope.modalSummary.hide();
		}
	}

	$scope.backtotarget = function(){
		$timeout(function(){$state.go('app.record1');},100);
		// $cordovaDialogs.alert($translate.instant('ADD9'), $translate.instant('AG15'), $translate.instant('AG33'))
		// 	.then(function() {
		// 	    $timeout(function(){$state.go('app.record1');},100);
		//     });
	}

	$scope.showSummary = function(){$scope.modalSummary.show();}
	
	$scope.hideAdditionalInfo = function(){$scope.modalInfo.hide();}
	$scope.showAdditionalInfo = function(){$scope.modalInfo.show();}
	$scope.showHcwInfo 		= function(){$scope.modalHcwInfo.show();}
	$scope.hideHcwInfo 		= function(){$scope.modalHcwInfo.hide();}
	
	
	if($stateParams.type == 'trial')
		$scope.observation.type = $stateParams.type;
	else if($stateParams.type == 'real')
		$scope.observation.type = $stateParams.type;
		
	

	if($state.current.name == 'app.record7')
	{
		$ionicHistory.nextViewOptions({disableBack: true});
		
		$ionicHistory.nextViewOptions({
			historyRoot: true,
			disableBack: true,
		});
		
		$ionicHistory.clearHistory();
	}
	$scope.pageTitle = $localStorage.pageTitle;
	$scope.recordStep = {
		one:function(item)
		{	
			$localStorage.tempMemberCount = [];

			if(!$scope.observation.numberOfObservations)
				$cordovaDialogs.alert($translate.instant('AG1'), $translate.instant('AG2'), $translate.instant('AG3'));
			
			else
			{
				$scope.observation.moment 					= {};
				$localStorage.observation 					= $scope.observation;
				//$state.go('app.record2');
				$state.go('app.record3');
			}
		},	
		two: function()
		{
			$localStorage.observation = $scope.observation;
			$state.go('app.record3');
		},
		three: function(item)
		{
			$scope.observation.location.levelOne = item;
			$localStorage.observation = $scope.observation;
			$state.go('app.record4');
		},
		four: function(item)
		{
			$scope.observation.location.levelTwo = item;
			$localStorage.observation = $scope.observation;
			$state.go('app.record5');
		},
		five: function(item)
		{
			$localStorage.observation.location.levelThree = item;
			$localStorage.observation = $scope.observation;
			$state.go('app.record6');
		},
		six: function(item)
		{
			console.log('item');
			console.log(item);
			$localStorage.observation.location.levelFour = item;

			console.log('$scope.observation.location.levelFour.name');
			console.log($scope.observation.location.levelFour.name);
			$localStorage.pageTitle = $scope.observation.location.levelFour.name;
			$scope.pageTitle = $localStorage.pageTitle;
			$localStorage.observation = $scope.observation;
			$state.go('app.record8');
		},
		seven: function(item)
		{
			if(!$localStorage.observation.healthWorker) $localStorage.observation.healthWorker = {};
			$localStorage.observation.healthWorker.type = item;
			$localStorage.observation = $scope.observation;
			$state.go('app.record8');
		},
		home: function(item)
		{
			//$cordovaDialogs.alert($translate.instant('ADD9'), $translate.instant('AG15'), $translate.instant('AG33'));
			//$state.go('app.home');
			$cordovaDialogs.confirm($translate.instant('ADD9'), $translate.instant('AG15'), [$translate.instant('AG17'), $translate.instant('AG16')])
			.then(function(buttonIndex) {
				
				if(buttonIndex != 2) return;
				else {
					$state.go('app.home');
				}
			});
		}
	}
	
	$scope.selectIndication = function( id )
	{
		if((id == 4 && $scope.multimoment.moment5 == 1) || (id == 5 && $scope.multimoment.moment4 == 1))
			$cordovaDialogs.alert($translate.instant('AG4'), $translate.instant('AG5'), $translate.instant('AG3'));
			
		else
			$scope.multimoment['moment'+id] = $scope.multimoment['moment'+id] == 1 ? 0 : 1;
	}
	
	$scope.multimoment = {moment:{}};

	$scope.multimoment.exposure = '';
    $scope.setActive = function(type) {
        $scope.multimoment.exposure = type;

		if($scope.multimoment.gloves == '-') {
			$scope.multimoment.gloves = 'NO';
		}
		if($scope.multimoment.gown == '-') {
			$scope.multimoment.gown = 'NO';
		}
		if($scope.multimoment.mask == '-') {
			$scope.multimoment.mask = 'NO';
		}
    };
    $scope.isActive = function(type) {
        return type === $scope.multimoment.exposure;
    };
    $scope.hcwChanged = function(item) {
    	$scope.observation.healthWorker.name = '';
	} 
	$scope.donOnChanged = function(item) {
		if($scope.multimoment.exposure == ''){
			if($scope.multimoment.gloves == 'NO' || $scope.multimoment.gloves == undefined) {
				$scope.multimoment.gloves = '-';
			}
			if($scope.multimoment.gown == 'NO' || $scope.multimoment.gown == undefined) {
				$scope.multimoment.gown = '-';
			}
			if($scope.multimoment.mask == 'NO' || $scope.multimoment.mask == undefined) {
				$scope.multimoment.mask = '-';
			}
		}
	} 

	$scope.multiObserveSend = function()
	{
		// console.log("Report Check Internet");
		// if(!ConnectivityMonitor.isOnline()) {
		// 	$cordovaDialogs.alert($translate.instant('ADD25'), $translate.instant('ADD26'), $translate.instant('ADD27'));
		// }
		// else
		// {
			var mm = $scope.multimoment;
			var ob = $scope.observation;
			
			if(!ob.healthWorker || !ob.healthWorker.type)
			{
				$cordovaDialogs.alert($translate.instant('AG6'), $translate.instant('AG7'), $translate.instant('AG3'));
				return;
			}
			else if(!mm.moment1 && !mm.moment2 && !mm.moment3 && !mm.moment4 && !mm.moment5)
			{
				$cordovaDialogs.alert($translate.instant('AG8'), $translate.instant('AG9'), $translate.instant('AG3'));
				return;
			}
			else if(!mm.compliance)
			{
				$cordovaDialogs.alert($translate.instant('AG10'), $translate.instant('AG11'), $translate.instant('AG3'));
				return;
			}
			else if(mm.mask == 'YES' && !mm.maskType)
			{
				$cordovaDialogs.alert($translate.instant('AG12'), $translate.instant('AG13'), $translate.instant('AG3'));
				return;
			}
			else {
				//Trial only
				if($scope.observation.type == 'trial')
				{
					$ionicLoading.show({template: '<ion-spinner></ion-spinner>'});
					$timeout(function(){
						$ionicLoading.hide();
						$ionicPopup.show({
							cssClass: 	'popup-success',
							template: 	'<i class="ion-ios-information-outline text-positive"></i><br/><p>'+$translate.instant('AG18')+'</p>',
							title: 		$translate.instant('AG19'),
							scope: 		$scope,
							buttons: [{
								text: $translate.instant('C11'),
								type: 'button-balanced',
								onTap: function(e){
									//$scope.observationCounter();
									$state.go('app.home');
								}
							}]
						});
					},1500);
					return;
				}
				
				//Submit
				$timeout(function(){
					
					var queryData = {
						uid 				: $localStorage.userData.id,
						cid 				: $localStorage.userData.cid,
						resend_id 			: moment().unix()+''+Math.random(),
						hcw_title 			: ob.healthWorker.type.id,
						hcw_name 			: ob.healthWorker.name ? ob.healthWorker.name : '',
						organization 		: ob.organizationName ? ob.organizationName : '',
						moment1				: mm.moment1 ? 1 : '',
						moment2				: mm.moment2 ? 2 : '',
						moment3				: mm.moment3 ? 3 : '',
						moment4				: mm.moment4 ? 4 : '',
						moment5				: mm.moment5 ? 5 : '',
						note				: ob.note ? ob.note : '',
						location_level1 	: ob.location.levelOne.id,
						location_level2 	: ob.location.levelTwo.id,
						location_level3 	: ob.location.levelThree.id,
						location_level4 	: ob.location.levelFour.id,
						hh_compliance 		: mm.compliance ? 	mm.compliance 	: '-',
						hh_compliance_type 	: mm.exposure ? 	mm.exposure		: '-',
						glove_compliance 	: mm.gloves ? 		mm.gloves 	: '-',
						gown_compliance 	: mm.gown ? 		mm.gown 	: '-',
						mask_compliance 	: mm.mask ? 		mm.mask 	: '-',
						mask_type 			: mm.maskType && mm.mask == 	$translate.instant('AG16') ? 	mm.maskType 	: '-',
						date_registered		: moment().format('YYYY-MM-DD HH:mm:ss')//Change date format to 24 hours
					}
					
					$ionicLoading.show({template: '<ion-spinner></ion-spinner>'});
					
					observation.multiObserveSend(queryData, function(data){
						//reset HCW name
						$scope.observation.healthWorker.name = "";

						//No internet connection
						var toastMessage = "";
						if(data.offline)
						{
							$localStorage.observation.summary.localDataCount++;
							$localStorage.observation.note = '';
							sqlite.multiObserveSave(queryData, function(result){
								if(result.rowsAffected > 0)
								{
									multiObserveSummary(queryData)
									.then( function( summary ){
										$scope.multimoment = {moment:{}};
									});
								}
							});
							
							toastMessage = $translate.instant('AG21');
							// $cordovaToast
							//     .show($translate.instant('AG21'), 'short', 'center')
							//     .then(function(success) {
							//       // success
							//     }, function (error) {
							//       // error
						 	//    });
							// $scope.popupTitle 	= $translate.instant('AG20');
							// $scope.popupMsg 	= '<i class="ion-information-circled"></i><br/><p>'+$translate.instant('AG21')+'</p>';
						}
						//With internet connection
						else
						{
							$localStorage.observation.summary.serverDataCount++;
							$localStorage.observation.note = '';
							multiObserveSummary(queryData)
							.then( function( summary ){
								$scope.multimoment = {moment:{}};
							});
							
							toastMessage = data.message;
							// $cordovaToast
							//     .show($translate.instant('AG23'), 'short', 'center')
							//     .then(function(success) {
							//       // success
							//     }, function (error) {
							//       // error
						 	//    });

							// $scope.popupTitle 	= $translate.instant('AG22');
							// $scope.popupMsg 	= '<i class="ion-android-checkmark-circle"></i><br/><p>'+$translate.instant('AG23')+'</p>';
						}

						//Popup alert
						$timeout(function(){
							console.log("CCC");
							$ionicLoading.hide();
							if(($localStorage.observation.summary.serverDataCount + $localStorage.observation.summary.localDataCount) >= ob.numberOfObservations)
							{
								$scope.popupTitle 	= $translate.instant('AG24');
								$scope.popupMsg 	= '<i class="ion-android-checkmark-circle"></i><br/><p>'+$translate.instant('AG25')+'</p>';
								var popupButton = [{
									text: $translate.instant('AG26'),
									type: 'button-balanced',
									onTap: function(e){
										$scope.observationDone = true;
										$timeout(function(){$scope.showSummary();},50);
									}
								}];

								$ionicPopup.show({
									cssClass: 	'popup-success',
									template: 	$scope.popupMsg,
									title: 		$scope.popupTitle,
									scope: 		$scope,
									buttons:	popupButton
								});
							}
							else
							{
								$cordovaToast
								    .show(toastMessage, 'short', 'center')
								    .then(function(success) {
								    	$state.go('app.record8');
								    }, function (error) {
								     	// error
						 		});
								
								// var popupButton = [
								// {
								// 	text: $translate.instant('AG28'),
								// 	type: 'button-balanced',
								// 	onTap: function(e){
								// 		$state.go('app.record8');
								// 	}
								// }]
							}
							

						},50);
					});
				});
			}
		// }
	}
	
		
		
	function multiObserveSummary(data)
	{
		var deferred = $q.defer();
		var ob 							= $localStorage.observation;
		$scope.summary 					= $localStorage.observation.summary.data;
		$scope.summary[data.hcw_title] 	= $scope.summary[data.hcw_title] ? $scope.summary[data.hcw_title] : {};
		
		$scope.memberCount = $localStorage.tempMemberCount;
		$scope.memberCount.push(data.hcw_title);
		$localStorage.tempMemberCount = $scope.memberCount;

		angular.forEach([1,2,3,4,5], function( m ){
			if(data['moment'+m] == m)
			{
				if( $scope.summary[data.hcw_title][m] !== undefined){
					if(data.hh_compliance == 'missed')
						$scope.summary[data.hcw_title][m].failed++;
					else
						$scope.summary[data.hcw_title][m].passed++;
				}
				else
					$scope.summary[data.hcw_title][m] = (data.hh_compliance == 'missed') ? {passed:0, failed: 1} : {passed:1, failed: 0};
			}
		});
		
		$scope.total	= {};
		$scope.passTotal	= {};
		$scope.memberTotal = {};

		angular.forEach($scope.summary, function(object, itemKey) {
			var total 	= 0;
			var stotal 	= 0;
			var members = 0;
			var passed 	= 0;
			

			angular.forEach(object, function(subObject, subItemKey) {
				
				$scope.summary[itemKey][subItemKey].percentage = subObject.passed / (subObject.passed + subObject.failed) * 100;
				total  	= total 	+ 100;
				stotal 	= stotal	+ $scope.summary[itemKey][subItemKey].percentage;
				members = members 	+ (subObject.passed + subObject.failed);
				passed 	= passed 	+ subObject.passed;
			});	

			
			$scope.total[itemKey] = {total:(passed / members * 100), members:members};
			$scope.passTotal[itemKey] = {pass:passed, total:members};
			$scope.memberTotal[itemKey] = $scope.memberCount.filter(function(val){
			    return val === itemKey;
			}).length;
		});

		$scope.members = $localStorage.observation.summary.members;
		if(!$scope.members) $scope.members = {};
		$scope.members[data.hcw_title] = (!$scope.members[data.hcw_title]) ? 1 : $scope.members[data.hcw_title]++;
		$localStorage.observation.summary.members 	= $scope.members;
		$localStorage.observation.summary.data 		= $scope.summary;
		$localStorage.observation.summary.total 	= $scope.total;


		//NEW RONALD 01/2017

		var totalPass = 0;
		var totalSubmit = 0;
		angular.forEach($scope.passTotal, function(value1, key1) {
			angular.forEach(value1,function(v1,k1) {//this is nested angular.forEach loop
            	if(k1 === "pass") {
            		totalPass = totalPass + v1
            	}
            	else {
            		totalSubmit = totalSubmit + v1;
            	}
        	});
		});

		//TODO: Alert here to check before showing in html
		$localStorage.observation.summary.passTotal 	= (totalPass/totalSubmit)*100;
		$localStorage.observation.summary.memberTotal 	= $scope.memberTotal;




		deferred.resolve($localStorage.observation.summary);
		return deferred.promise;
	}
	
	
	
	$scope.cancelObservation = function()
	{
		$timeout(function(){
			$cordovaDialogs.confirm($translate.instant('AG29'), $translate.instant('AG15'), [$translate.instant('AG17'), $translate.instant('AG16')])
			.then(function(buttonIndex) {
				
				if(buttonIndex != 2) return;
				
				if($localStorage.observation.numberOfObservationsDone != undefined && $localStorage.observation.numberOfObservationsDone > 0)
					$state.go('app.record11');
				else
					$state.go('app.home');
			});
		});
	}
	
	$scope.popUpNote = function()
	{
		var template = '<span style="font-size:11px; float:right;">{{150 - observation.note.length}}/150</span>';
		template += '<textarea ng-model="observation.note" rows="5" char-limit="150" focus-me></textarea>';
		
		$scope.notePopup = $ionicPopup.show({
			template: 	template,
			title: 		$translate.instant('AE5'),
			scope: 	 	$scope,
			buttons: 	[
				{
					text: '<b>'+$translate.instant('AE6')+'</b>',
					type: 'button-light',
					onTap: function(e) {
						$scope.observation.note = '';
					}
				},
				{text: '<b>'+$translate.instant('AE7')+'</b>', type: 'button-balanced'}
			]
		});
	}
	
	$scope.sendConfirmation = function()
	{
		$localStorage.observation.stepOne 			= $localStorage.observation.moment.stepOne;
		$localStorage.observation.stepTwo 			= $localStorage.observation.moment.stepTwo;
		$localStorage.observation.maskType 			= $localStorage.observation.moment.maskType;
		$localStorage.observation.compliance 		= $localStorage.observation.moment.type;
		$localStorage.observation.dateTime 			= $localStorage.observation.moment.dateTime;
		$localStorage.observation.gloveCompliance 	= $localStorage.observation.moment.glove;
		$localStorage.observation.gownCompliance 	= $localStorage.observation.moment.gown;
		$localStorage.observation.maskCompliance 	= $localStorage.observation.moment.mask;
		$localStorage.observation.note 				= $localStorage.observation.moment.note;
		
		if(!$localStorage.observation.moment || !$localStorage.observation.moment.type)
			$cordovaDialogs.alert($translate.instant('AG30'), $translate.instant('AG2'), $translate.instant('AG3'));
		
		else if(!$scope.observation.moment.stepOne)
			$cordovaDialogs.alert($translate.instant('AG31'), $translate.instant('AG2'), $translate.instant('AG3'));
		else
		{
			$state.go('app.record10');
		}
	}
	
	$scope.getNestedValue = function(objects, key, value)
	{
		var result = [];
		angular.forEach(objects, function(object, itemKey) {
			
			if(object[key] == value)
			{
				this.push(object);
			}
		},result);
		return result[0];
	}

	$scope.moveLocation = function () {
		$state.go('app.record3');
	}

	$scope.stopObserving = function () {
		$cordovaDialogs.confirm($translate.instant('ADD30'), $translate.instant('AG15'), [$translate.instant('AG17'), $translate.instant('AG16')])
		.then(function(buttonIndex) {
			
			if(buttonIndex != 2){
				return;
			}
			else {
				$scope.observationDone = true;
				$timeout(function(){$scope.showSummary();},50);
			}
		});
	}

})