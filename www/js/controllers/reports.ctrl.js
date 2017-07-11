angular.module('reports.ctrl', [])
.controller('reportsCtrl', function($scope, $rootScope, $filter, $state, $ionicActionSheet, $stateParams, $timeout, $localStorage, $ionicPopup, $cordovaDialogs, $ionicLoading, $timeout, $cordovaNetwork, observation, $translate, ConnectivityMonitor){
	if(!$localStorage.userData) $state.go('login');
	
	$scope.$storage 		= $localStorage;
	$scope.observations		= [];
	$scope.lastid			= 0;
	$scope.showLoader		= true;
	$scope.filteredNote		= '';
	$scope.filterMessage	= $translate.instant('V1');
	$scope.today			= new Date();
	$scope.dateDivider		= '';
	
	
	if($localStorage.filterSummary)
	{
		$scope.filter = $localStorage.filterSummary;
		$scope.filter.download = 0;
	}
	else
	{
		$scope.filter = {
			uid			:(!$stateParams.uid) ? $scope.$storage.userData.id : $stateParams.uid,
			download	:0,
			dateFrom	:new Date(),
			dateTo		:new Date()
		}
	}
	
	$scope.filter.auditor = null;
	//if($stateParams.uid && $stateParams.uid > 0) $scope.filter.auditor = $stateParams.uid;
	$scope.$storage.selectedReport = $stateParams.uid;
	
	$scope.networkState	= 1;
	document.addEventListener("deviceready", function () {
		$rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
			$scope.networkState = 0;
		})
		// listen for Online event
		$rootScope.$on('$cordovaNetwork:online', function(event, networkState){
			$scope.networkState = 1;
		});
	});
	
	$scope.loadMore = function(callback)
	{
		$timeout(function(){		
			if($scope.filter.lastid == 1) return;
			$scope.filter.download = 0;
			
			console.log($scope.filter.auditor);
			$localStorage.filterSummary = $scope.filter;
			$ionicLoading.show({template: '<ion-spinner></ion-spinner><br>'+$translate.instant('APP12')});
			// $ionicLoading.show({template: '<ion-spinner></ion-spinner>'});
			observation.getReports($scope.filter, function(data){
				if(data.status)
				{
					console.log("data.result.data");
					console.log(data.result.data);
					console.log(data.result.data.length);
					$scope.reportTotal = data.result.data.length;
					
					$scope.reportHcw = data.result.data.reduce((p,c,i,a) => {
					    if(!p[0][c.hcw_title]) {
					        p[1].push(p[0][c.hcw_title] = c.hcw_title);
					    }
					    if(i<a.length-1) {
					        return p
					    } else {
					        return p[1]
					    }
					}, [{},[]])

					$scope.reportHcwTitle = [];
					for (i = 0; i < $scope.reportHcw.length; i++) { 
					    $scope.reportHcwTitle.push({'title': $scope.reportHcw[i], 'count': 0});
					}

					angular.forEach(data.result.data, function(obj) {
						$scope.observations.push(obj);
						angular.forEach($scope.reportHcwTitle, function(hcw) {
							if(obj.hcw_title === hcw.title)
								hcw.count++;
						});
					});
					console.log($scope.reportHcw);
					console.log($scope.reportHcwTitle);
					if((moment().format('ll') != data.result.date.from || moment().format('ll') != data.result.date.to))
						$scope.filteredNote	= data.result.date.from+' to '+data.result.date.to;
					else
						$scope.filteredNote	= '';
						
					if( typeof callback == 'function') callback(data.result.data);
				}
				else
				{
					$cordovaDialogs.alert(data.message, $translate.instant('V2'), $translate.instant('V3'));
				}
				
				
				$ionicLoading.hide();
			});
		});
		//$scope.filter.lastid = 1;
	}
	
	$scope.loadMore();
	
	
	$scope.emailReport = function()
	{
		console.log("Report Check Internet");
		if(!ConnectivityMonitor.isOnline()) {
			$cordovaDialogs.alert($translate.instant('ADD25'), $translate.instant('ADD26'), $translate.instant('ADD27'));
		}
		else
		{
			if($scope.observations.length == 0)
			{
				$cordovaDialogs.alert($translate.instant('V4'), $translate.instant('V5'), $translate.instant('V3'));
				return;
			}
			
			$ionicActionSheet.show({
				buttons: [
					//{ text: 'PDF' },
					{ text: 'EXCEL' }
					//{ text: 'BOTH' }
				],
				titleText: 'Report Type',
				cancelText: $translate.instant('V7'),
				buttonClicked: function(index)
				{
					$timeout(function(){			
						if($cordovaNetwork.isOffline())
						{
							$cordovaDialogs.alert($translate.instant('V8'), $translate.instant('V9'), $translate.instant('V3'));
							return false;
						}
						
						$ionicLoading.show({template: '<ion-spinner>Loading...</ion-spinner><br>'+$translate.instant('APP13')});
						// $ionicLoading.show({template: '<ion-spinner></ion-spinner><br>'+$translate.instant('V10')});
						$scope.filter.download = index + 1;
						
						observation.getReports($scope.filter, function(data){
							
							$ionicLoading.hide();
							if(data.status)
							{
								$ionicPopup.show({
									cssClass: 	'popup-success',
									template: 	'<i class="ion-android-checkmark-circle"></i><br/><p>'+data.message+'</p>',
									title: 		$translate.instant('V11'),
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
								$cordovaDialogs.alert(data.message, $translate.instant('C12'), $translate.instant('V3'));
							}
						});
					});
					
					return true;
				}
			});
		}	
	}
	
	
	
	$scope.filterDateValidation = function()
	{
		if(!$scope.filter.dateFrom)
		{
			$cordovaDialogs.alert($translate.instant('V12'), $translate.instant('V13'), $translate.instant('V3'));
			return false;
		}
		
		else if(!$scope.filter.dateTo)
		{
			$cordovaDialogs.alert($translate.instant('X12'), $translate.instant('V13'), $translate.instant('V3'));
			return false;
		}	
		else
		{
			var from 	= moment($scope.filter.dateFrom).format('x');
			var to 		= moment($scope.filter.dateTo).format('x');
			var diff 	= parseInt(to) - parseInt(from);
			
			if( diff < 0 )
			{
				$cordovaDialogs.alert($translate.instant('X13'), $translate.instant('X10'), $translate.instant('V3'));
				return false;
			}
			else 
				return true;
		}
	}
	
	$scope.filterReport = function()
	{	
		console.log("Report Check Internet");
		if(!ConnectivityMonitor.isOnline()) {
			$cordovaDialogs.alert($translate.instant('ADD25'), $translate.instant('ADD26'), $translate.instant('ADD27'));
		}
		else
		{
			$ionicPopup.show({
				cssClass: 		'popup-success',
				templateUrl: 	'templates/filter-options.html',
				title: 			$translate.instant('T1'),
				scope: 			$scope,
				buttons: [
					{
						text: $translate.instant('T10'),
						type: 'button-stable'
					},
					{
						text: $translate.instant('V16'),
						type: 'button-balanced',
						onTap: function(e)
						{
							if( !$scope.filterDateValidation())
							{
								e.preventDefault();
								return;
							}
					
							$scope.observations 	= [];
							$scope.filter.lastid 	= 0;
							$scope.loadMore(function(){
								$scope.filterMessage = $translate.instant('T13');
							});
						}
					}
				]
			});
		}
	}
	
	$scope.viewSingle = function(data)
	{
		$localStorage.reportData = data;
		$state.go('app.report', {'id':data.id});
	}
})
