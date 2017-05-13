angular.module('summary.ctrl', [])

.controller('summaryCtrl', function(ConnectivityMonitor, $scope, $state, $cordovaDialogs, $localStorage, $ionicPopup, $ionicLoading, observation, sqlite, $translate){
	if(!$localStorage.userData) $state.go('login');
	
	$scope.$storage 	= $localStorage;
	$scope.today		= new Date();
	
	if($localStorage.filterSummary)
	{
		$scope.filter = $localStorage.filterSummary;
		$scope.filter.dateFrom 	= new Date($scope.filter.dateFrom);
		$scope.filter.dateTo 	= new Date($scope.filter.dateTo);
	}
	else
		$scope.filter = {dateFrom: new Date(),dateTo: new Date()};
	
	$scope.getStatistics 	= function()
	{
		$ionicLoading.show({template: '<ion-spinner></ion-spinner>'});
		$localStorage.filterSummary = $scope.filter;

		console.log("Summary Check Internet");
		if(!ConnectivityMonitor.isOnline()) {
			//$cordovaDialogs.alert($translate.instant('ADD25'), $translate.instant('ADD26'), $translate.instant('ADD27'));
			$cordovaToast
			    .show($translate.instant('ADD25'), 'short', 'center')
			    .then(function(success) {
			    	if(typeof callback == 'function') callback(data);
			    }, function (error) {
			     	// error
	 		});
		}
		else
		{
			console.log("$scope.filter");
			console.log($scope.filter.auditor);
			observation.getStatistics($scope.filter, function(data){
				if(data.status)
				{
					$scope.statistics 						= data.result;
					$localStorage.defaultData.statistics 	= data.result;
					$ionicLoading.hide();
					$scope.statistics.totalPassed = 0;
					$scope.statistics.totalFailed = 0;

					var tempData = [];
					angular.forEach($scope.statistics.momentRecords, function(res, key){
						$scope.statistics.totalPassed += parseInt(res.passed);
						$scope.statistics.totalFailed += parseInt(res.failed);
						percentage = parseInt(res.passed) / (parseInt(res.passed) + parseInt(res.failed)) * 100;
						$scope.statistics.momentRecords[key].percentage = isNaN(percentage) ? 0 : percentage;
						tempData.push(parseInt($scope.statistics.momentRecords[key].percentage.toFixed(0)));
					});
					
					totalPercentage = $scope.statistics.totalPassed / ($scope.statistics.totalPassed + $scope.statistics.totalFailed) * 100;
					$scope.statistics.totalPercentage  = isNaN(totalPercentage) ? 0 : totalPercentage;
					tempData.push(parseInt($scope.statistics.totalPercentage.toFixed(0)));


					if((moment().format('ll') != data.result.date.from || moment().format('ll') != data.result.date.to))
							$scope.filteredNote	= data.result.date.from+' to '+data.result.date.to;
						else
							$scope.filteredNote	= '';
					

					sqlite.countObservations( function( count ) {
						$scope.statistics.unsentRecords = count;
					})

				    $scope.chartObject = {};

				    $scope.chartObject.type = "ColumnChart";

				    $scope.chartObject.options = {
				        //'title': 'How Much Pizza I Ate Last Night'
				        bar: {
						    groupWidth: "80%"
						},
						chartArea:{
							//left:0,
							top:15,
							height:'80%',
		            		width: '85%'},
						//height: 175,
		            	width: '100%',
						'vAxis': {
							viewWindow: { min: 0, max: 100 },
						    // gridlines: {
						    //     count: Math.ceil(10)
						    // },
						    baselineColor: '#FFFFFF',
						    textStyle:{color: '#FFF'}
		            	},
		            	'hAxis': {
						    //textPosition: 'none',
						    gridlines: {
						        //count: 25
						    },
						    baselineColor: '#FFFFFF',
						    textStyle:{color: '#FFF'}
						},
					    'annotations': {
					     	'textStyle': {
					    		'fontSize': 10,
					        	'auraColor': 'none'
					      	},
					      	'boxStyle': {
					        	'stroke': '#888888', 'strokeWidth': 0.5,
					        	'rx': 2, 'ry': 2,
					        	'gradient': {
					          		'color1': '#eeeeee',
					          		'color2': '#dddddd',
					          		'x1': '0%', 'y1': '0%',
					          		'x2': '0%', 'y2': '100%',
					          		'useObjectBoundingBoxUnits': true
					        	}
					    	}
					    },
		            	animation:{
					        duration: 1000,
					        easing: 'out',
	          				startup: true
					    },
		            	legend : 'none',
		            	backgroundColor: { fill:'transparent' },
		            	
				    };
				    
					$scope.chartObject.data = google.visualization.arrayToDataTable([
				        ['Moment', '%', { role: 'style' }, { role: 'annotation' } ],
				        ['1', tempData[0], 'stroke-color: white; stroke-width: 2; fill-color: #34c29a', tempData[0]+'%'],
				        ['2', tempData[1], 'stroke-color: white; stroke-width: 2; fill-color: #34c29a', tempData[1]+'%'],
				        ['3', tempData[2], 'stroke-color: white; stroke-width: 2; fill-color: #34c29a', tempData[2]+'%'],
				        ['4', tempData[3], 'stroke-color: white; stroke-width: 2; fill-color: #34c29a', tempData[3]+'%'],
				        ['5', tempData[4], 'stroke-color: white; stroke-width: 2; fill-color: #34c29a', tempData[4]+'%'],
				        ['Total', tempData[5], 'stroke-color: white; stroke-width: 2; fill-color: #089b74', tempData[5]+'%']
			        ]);

					

				}
			});
			
			return true;
		}
	}
	
	$scope.filterSummary = function()
	{
		$ionicPopup.show({
			cssClass: 		'popup-success',
			templateUrl: 	'templates/filter-options.html',
			title: 			$translate.instant('X3'),
			scope: 			$scope,
			buttons: [{
					text: $translate.instant('T10'),
					type: 'button-stable'
				},
				{
					text: $translate.instant('X8'),
					type: 'button-balanced',
					onTap: function(e){
						if( !$scope.filterDateValidation() )
						{
							e.preventDefault();
							return;
						}
						$scope.getStatistics();
					}
				}
			]
		});
	}
	
	$ionicPopup.show({
		cssClass: 	'popup-success',
		template: 	 
		template = '<div class="list text-left">'+
			'<label class="item item-input">'+
			'<span class="input-label">'+$translate.instant('X5')+'</span>'+
			'<input type="date" ng-model="filter.dateFrom" placeholder="Date From" ng-max="today" date-format/>'+
			'</label>'+
			'<label class="item item-input">'+
			'<span class="input-label">'+$translate.instant('X6')+'</span>'+
			'<input type="date" ng-model="filter.dateTo" placeholder="Date To" date-format/>'+
			'</label>'+
			'</div>',
		title: 		$translate.instant('X7'),
		scope: 		$scope,
		buttons: [{
				text: $translate.instant('X8'),
				type: 'button-balanced',
				onTap: function(e){
					
					if( !$scope.filterDateValidation())
					{
						e.preventDefault();
						return;
					}
					$scope.getStatistics();
				}
			}
		]
	});
	
	
	$scope.filterDateValidation = function()
	{
		console.log(JSON.stringify($scope.filter))
		if(!$scope.filter.dateFrom)
		{
			$cordovaDialogs.alert($translate.instant('X9'), $translate.instant('X10'), $translate.instant('X11'));
			return false;
		}
		
		else if(!$scope.filter.dateTo)
		{
			$cordovaDialogs.alert($translate.instant('X12'), $translate.instant('X10'), $translate.instant('X11'));
			return false;
		}	
		else
		{
			var from 	= moment($scope.filter.dateFrom).format('x');
			var to 		= moment($scope.filter.dateTo).format('x');
			var diff 	= parseInt(to) - parseInt(from);
			
			if( diff < 0 )
			{
				$cordovaDialogs.alert($translate.instant('X13'), $translate.instant('X10'), $translate.instant('X11'));
				return false;
			}
			else 
				return true;
		}
	}


})