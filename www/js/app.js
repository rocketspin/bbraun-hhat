var db = null;
//var rest_addr = "http://localhost:8888/bbraun-hhat/api/";	//local - start MAMP
//var rest_addr = 'http://hhat.local/api/api/';		//Staging
var rest_addr = 'http://rocketspin.ph/api/api/';	//Live

angular.module('starter', [
	'ionic',
	'starter.controllers',
	'starter.services',
	'ngCordova',
	'ngStorage',
	'igCharLimit',
	'readMore',
	'starter.queries',
	'ngCookies',
	// 'chart.js',
	'pascalprecht.translate',
	'googlechart'
])

.config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['self', new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$')]);
})
.run(function(ConnectivityMonitor, $cordovaDevice, $cordovaNetwork, $cordovaDialogs, $ionicPlatform, $ionicPopup, $cordovaStatusbar, $cordovaSQLite, $localStorage, $state, $translate)
{
	$ionicPlatform.ready( function()
	{
		console.log(ConnectivityMonitor.isOnline());
		if(!ConnectivityMonitor.isOnline()) {
			$cordovaDialogs.alert($translate.instant('ADD25'), $translate.instant('ADD26'), $translate.instant('ADD27'))
			.then(function() {
		    	//ionic.Platform.exitApp();
				navigator.app.exitApp();
		    });
			
		}
		// else {
		// 	loadScript = function(){
		//       var script = document.createElement('script');
		//       script.type = 'text/javascript';
		//       script.src = 'https://cdnjs.cloudflare.com/ajax/libs/angular-google-chart/0.1.0/ng-google-chart.min.js';
		//       document.body.appendChild(script);
		//     };
		// 	window.loadScript();
		// }
		

		if($cordovaDevice.getPlatform()=="Android"){
            // Works on android but not in iOS
            db = $cordovaSQLite.openDB({ name: "hhat.db", iosDatabaseLocation:'default'}); 
		} else{
            // Works on iOS 
            db = window.sqlitePlugin.openDatabase({ name: "hhat.db", location: 2, createFromLocation: 1}); 
		}
		//db = $cordovaSQLite.openDB("hhat.db");
		$cordovaSQLite.execute(db,
			"CREATE TABLE IF NOT EXISTS observations("+
			"id INTEGER PRIMARY KEY,"+
			"uid INTEGER,"+
			"cid INTEGER,"+
			"resend_id NVARCHAR(100),"+
			"hcw_title NVARCHAR(60),"+
			"hcw_name NVARCHAR(100),"+
			"organization VARCHAR(150),"+
			"moment1 INTEGER,"+
			"moment2 INTEGER,"+
			"moment3 INTEGER,"+
			"moment4 INTEGER,"+
			"moment5 INTEGER,"+
			"note VARCHAR(150),"+
			"location_level1 INTEGER,"+
			"location_level2 INTEGER,"+
			"location_level3 INTEGER,"+
			"location_level4 INTEGER,"+
			"hh_compliance NVARCHAR(60),"+
			"hh_compliance_type NVARCHAR(60),"+
			"glove_compliance NVARCHAR(60),"+
			"gown_compliance VARCHAR(60),"+
			"mask_compliance NVARCHAR(60),"+
			"mask_type NVARCHAR(60),"+
			"date_registered NVARCHAR(40)"+
			")"
		);
	});
})


.run(function($rootScope, $timeout, $localStorage,$cookies, $http, $state, $cordovaNetwork, $ionicLoading, $cordovaDialogs, observation, sqlite, $translate) {
	function resendObservation(countObservations)
	{
		var count = countObservations;
		sqlite.getObservations( function( data )
		{
			if( data.length > 0 ) {
				var tempId = data[0].id;
				observation.multiObserveSend( data[0], function( result )
				{
					if( ( result.status == 1 && !result.offline ) ){
						sentSuccessfully = true;
						sqlite.deleteObservation(tempId, function( delResult ) {
							resendObservation(count);
						});
					}
					else {
						sentSuccessfully = false;
						return
					}
				});
			}
			else {
				if(count > 1) {
					$cordovaDialogs.alert($translate.instant('APP7') + count + $translate.instant('APP8'), $translate.instant('APP9'), $translate.instant('C1')).then(function() {});
				}
				else {
					$cordovaDialogs.alert($translate.instant('APP10') + count + $translate.instant('APP11'), $translate.instant('APP9'), $translate.instant('C1')).then(function() {});
				}
			}
		});

	}

	document.addEventListener("deviceready", function () {
		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){

			if($cordovaNetwork.isOffline()) return;
			if($localStorage.userData && toState.name.substring(0, 4) == 'app.')
			{
				//
				//if(!$cookies.get('UID'))
				if(moment().unix() >= $localStorage.expiration)
				{
					$localStorage.$reset({
						defaultData	: $localStorage.defaultData,
						locations	: $localStorage.locations,
						members		: $localStorage.members
					});
					$timeout(function(){$state.go('login')},50);
				}

				observation.checkUpdate(function(data){
					if(data != undefined && data.result == 1)
					{
						$cordovaDialogs.alert($translate.instant('APP1'), $translate.instant('APP2'), $translate.instant('APP3'))
						.then(function() {
							$ionicLoading.show({template: '<ion-spinner></ion-spinner><br>'+$translate.instant('APP4')});
							$timeout(function(){
								observation.getLocations(function(result){
									if(result.status == 1)
									{
										$localStorage.locations = result.result;
										$cordovaDialogs.alert($translate.instant('APP5'), $translate.instant('R3'), $translate.instant('R4'));
									}
									else
									{
										$cordovaDialogs.alert(data.message, $translate.instant('APP6'), $translate.instant('C1'));
									}
									$ionicLoading.hide();
								});
							},1000);
						});
					}
				});
			}

			if($localStorage.defaultData && $http.pendingRequests.length === 0)
			{
				sqlite.countObservations( function( result ) {
					if(result > 0) {
						resendObservation(result);
						// if(result > 1) {
						// $cordovaDialogs.alert($translate.instant('APP7') + result + $translate.instant('APP8'), $translate.instant('APP9'), $translate.instant('C1')).then(function() {});
						// }
						// else {
						// 	$cordovaDialogs.alert($translate.instant('APP10') + result + $translate.instant('APP11'), $translate.instant('APP9'), $translate.instant('C1')).then(function() {});
						// }
					}
				})
			}
		});
	});
})


.directive('focusMe', function($timeout) {
	return {
		link: function(scope, element, attrs) {
			$timeout(function() {
				element[0].focus();
			},400);
		}
	};
})
.directive('barSelect',function($parse){
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      model: '=ngModel',
      value: '=barSelect'
    },
    link: function(scope, element, attrs, ngModelCtrl){
      element.addClass('button button-balanced button-outline');
      element.on('click', function(e){
        scope.$apply(function(){
          ngModelCtrl.$setViewValue(scope.value);
        });
      });

      scope.$watch('model', function(newVal){
        element.addClass('button-outline');
        if (newVal === scope.value){

		  element.removeClass('button-outline');
        }
      });
    }
  };
})

.directive('dateFormat', function() {
	return {
	require: 'ngModel',
	link: function(scope, element, attrs, ngModelController) {
		ngModelController.$parsers.push(function(data) {
			//convert data from view format to model format
			return new Date(data); //converted
		});

		ngModelController.$formatters.push(function(data) {
			//convert data from model format to view format
			return new Date(data); //converted
		});
		}
	}
})

.config(function($stateProvider, $urlRouterProvider, $translateProvider) {
  
	for(lang in translations){
		$translateProvider.translations(lang, translations[lang]);
	}

	$translateProvider.preferredLanguage('en');
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

	.state('intro', {
		url: "/intro",
		templateUrl: "templates/intro.html",
		controller:'introCtrl'
	})

	.state('login', {
		url: "/login",
		cache: false,
		templateUrl: "templates/login.html",
		controller: 'loginCtrl'
	})

	.state('terms', {
		url: "/terms",
		templateUrl: "templates/terms.html",
	})

	.state('password', {
		url: "/password",
		templateUrl: "templates/password.html",
		controller: 'loginCtrl'
	})

	.state('contact', {
		url: "/contact",
		templateUrl: "templates/contact.html",
		controller: 'contactCtrl'
	})

	.state('logout', {
		url: "/logout",
		template: "",
		cache: false,
		controller:'logoutCtrl'
	})

	.state('app', {
		url: '/app',
		abstract: true,
		templateUrl: 'templates/menu.html',
		controller:'homeCtrl',
		cache: false,
	})

	.state('app.home', {
		url: '/home',
			views: {
			'menuContent': {
				templateUrl: 'templates/home.html',
				controller:'homeCtrl'
			}
		}
	})

	.state('app.intro', {
		url: '/intro',
			views: {
			'menuContent': {
				templateUrl: 'templates/intro.html',
				controller: 'introCtrl'
			}
		}
	})

	.state('app.record1', {
		url: '/startrecord/:type',
		cache:false,
		views: {
			'menuContent': {
				templateUrl: 'templates/record1.html',
				controller:'observeCtrl'
			}
		}
	})

	.state('app.record2', {
		url: '/record/2',
		cache:false,
		views: {
			'menuContent': {
				templateUrl: 'templates/record2.html',
				controller:'observeCtrl'
			}
		}
	})

	.state('app.record3', {
		url: '/record/3',
		cache:false,
		views: {
			'menuContent': {
				templateUrl: 'templates/record3.html',
				controller:'observeCtrl'
			}
		}
	})
	.state('app.record4', {
		url: '/record/4',
		cache:false,
		views: {
			'menuContent': {
				templateUrl: 'templates/record4.html',
				controller:'observeCtrl'
			}
		}
	})

	.state('app.record5', {
		url: '/record/5',
		cache:false,
		views: {
			'menuContent': {
				templateUrl: 'templates/record5.html',
				controller:'observeCtrl'
			}
		}
	})

	.state('app.record6', {
		url: '/record/6',
		cache:false,
		views: {
			'menuContent': {
				templateUrl: 'templates/record6.html',
				controller:'observeCtrl'
			}
		}
	})

	.state('app.record7', {
		url: '/record/7',
		cache:false,
		views: {
			'menuContent': {
				templateUrl: 'templates/record7.html',
				controller:'observeCtrl'
			}
		}
	})

	.state('app.record8', {
		url: '/record/8',
		cache:false,
		views: {
			'menuContent': {
				templateUrl: 'templates/record8.html',
				controller:'observeCtrl'
			}
		}
	})

	.state('app.record9', {
		url: '/record/9',
		cache:false,
		views: {
			'menuContent': {
				templateUrl: 'templates/record9.html',
				controller:'observeCtrl'
			}
		}
	})

	.state('app.record10', {
		url: '/record/10',
		cache:false,
		views: {
			'menuContent': {
				templateUrl: 'templates/record10.html',
				controller:'observeCtrl'
			}
		}
	})

	.state('app.record11', {
		url: '/record/11',
		cache:false,
		views: {
			'menuContent': {
				templateUrl: 'templates/record11.html',
				controller:'observeCtrl'
			}
		}
	})

	.state('app.observation_summary', {
		url: '/moments/observation_summary',
		cache: false,
		views: {
			'menuContent': {
				templateUrl: 'templates/observation-summary.html',
				controller:'observeCtrl'
			}
		}
	})

	.state('app.summary', {
		url: '/summary',
		cache: false,
		views: {
			'menuContent': {
				templateUrl: 'templates/summary.html',
				controller:'summaryCtrl'
			}
		}
	})

	.state('app.auditors', {
		url: '/auditors',
		views: {
			'menuContent': {
				templateUrl: 'templates/reports-selection.html',
				controller:'auditorsCtrl'
			}
		}
	})

	.state('app.reports', {
		url: '/reports/:uid',
		cache: false,
		views: {
			'menuContent': {
				templateUrl: 'templates/reports.html',
				controller:'reportsCtrl',
			}
		}
	})

	.state('app.report', {
		url: '/report/:id',
		views: {
			'menuContent': {
				templateUrl: 'templates/view-report.html',
			}
		}
	})

	.state('app.profile', {
		url: '/profile',
		cache: false,
		views: {
			'menuContent': {
				templateUrl: 'templates/profile.html',
				controller:'profileCtrl'
			}
		}
	})

	.state('app.simulation', {
		url: '/simulation',
		views: {
			'menuContent': {
				templateUrl: 'templates/simulation.html'
			}
		}
	})

	.state('app.videos', {
		url: '/videos',
		views: {
			'menuContent': {
				templateUrl: 'templates/videos.html',
				controller:'playerCtrl'
			}
		}
	})

	.state('app.5moments', {
		url: '/5moments',
		views: {
			'menuContent': {
				templateUrl: 'templates/5moments-videos.html',
				controller:'playerCtrl'
			}
		}
	})

	.state('app.ghhea', {
		url: '/ghhea',
		views: {
			'menuContent': {
				templateUrl: 'templates/ghhea-videos.html',
				controller:'playerCtrl'
			}
		}
	})


	.state('app.journal_languages', {
		url: '/journal-medicine',
		views: {
			'menuContent': {
				templateUrl: 'templates/journal-medicine-languages.html',
				controller:'playerCtrl'
			}
		}
	})

	.state('app.journal_video', {
		url: '/journal-medicine-videos/:link/:language',
		views: {
			'menuContent': {
				templateUrl: 'templates/journal-medicine-videos.html',
				controller:'playerCtrl'
			}
		}
	})

	.state('app.player', {
		url: '/player',
		views: {
			'menuContent': {
				templateUrl: 'templates/player.html',
				controller:'videoCtrl'
			}
		}
	})

	.state('app.faq', {
		url: '/faq',
		views: {
			'menuContent': {
				templateUrl: 'templates/faq.html',
				controller: 'faqCtrl'
			}
		}
	})

	.state('app.faqitem', {
		url: '/faq/:id',
		views: {
			'menuContent': {
				templateUrl: 'templates/faq-item.html',
				controller: 'faqCtrl'
			}
		}
	});

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
