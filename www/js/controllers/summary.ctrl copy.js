angular.module('summary.ctrl', [])

.controller('summaryCtrl', function($scope, $state, $cordovaDialogs, $localStorage, $ionicPopup, $ionicLoading, observation, sqlite, $translate){
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
		observation.getStatistics($scope.filter, function(data){
			if(data.status)
			{
				$scope.statistics 						= data.result;
				$localStorage.defaultData.statistics 	= data.result;
				$ionicLoading.hide();
				$scope.statistics.totalPassed = 0;
				$scope.statistics.totalFailed = 0;
				// $scope.labels 	= ['1', '2', '3', '4', '5', $translate.instant('X1')];
				// $scope.series 	= [$translate.instant('X2')];
				// $scope.colors = ['#FFFFFF'];
				

				// $scope.data  	= [[]];
				var dict = [{}];	

				angular.forEach($scope.statistics.momentRecords, function(res, key){
					$scope.statistics.totalPassed += parseInt(res.passed);
					$scope.statistics.totalFailed += parseInt(res.failed);
					percentage = parseInt(res.passed) / (parseInt(res.passed) + parseInt(res.failed)) * 100;
					$scope.statistics.momentRecords[key].percentage = isNaN(percentage) ? 0 : percentage;
					dict[key] = {label: key , y: parseInt($scope.statistics.momentRecords[key].percentage.toFixed(0)), indexLabel: parseInt($scope.statistics.momentRecords[key].percentage.toFixed(0)).toString()+"%", indexLabelFontColor: "white"};
				})
				
				totalPercentage = $scope.statistics.totalPassed / ($scope.statistics.totalPassed + $scope.statistics.totalFailed) * 100;
				$scope.statistics.totalPercentage  = isNaN(totalPercentage) ? 0 : totalPercentage;

				dict[6] = {label: $translate.instant('X1') , y: parseInt($scope.statistics.totalPercentage.toFixed(0)), indexLabel: parseInt($scope.statistics.totalPercentage.toFixed(0)).toString()+"%", indexLabelFontColor: "white"};
				dict.splice(0, 1);

				if((moment().format('ll') != data.result.date.from || moment().format('ll') != data.result.date.to))
						$scope.filteredNote	= data.result.date.from+' to '+data.result.date.to;
					else
						$scope.filteredNote	= '';
				

				sqlite.countObservations( function( count ) {
					$scope.statistics.unsentRecords = count;
				})

				CanvasJS.addColorSet("greenShades",
                [
	                // "#2E8B57",
	                // "#2E8B57",
	                // "#2E8B57",
	                // "#2E8B57",
	                // "#2E8B57",
	                // "#008080"
	                "#089b74",
	                "#089b74",
	                "#089b74",
	                "#089b74",
	                "#089b74",
	                "darkgray"            
                ]);
				var chart = new CanvasJS.Chart("chartContainer", {
					colorSet: "greenShades",
					theme: "theme4",
					animationEnabled: true,   // change to true
					data: [              
						{
							// Change type to "bar", "area", "spline", "pie",etc.
							type: "column",	
							toolTipContent: "Moment {label}: {y}%",
							dataPoints: dict,
							markerType: "square",
					        markerSize: 20,
					        markerBorderColor : "black", //change color here
					        markerBorderThickness: 2
						}
					],
					backgroundColor: "#00b482",
					axisX:{
						lineColor: "white",
						titleFontColor: "white",
						labelFontColor: "white",
						tickColor: "white",
						labelFontWeight: "bolder",
						gridColor: "white"

					},
					axisY:{
						interval: 25,
				    	minimum: 0,
				        maximum: 100,
						lineColor: "white",
						titleFontColor: "white",
						labelFontColor: "white",
						tickColor: "white",
						labelFontWeight: "bold",
						gridColor: "white"
					}
				});
				chart.render();




				

			}
		});
		
		return true;
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