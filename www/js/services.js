angular.module('starter.services', [])

.factory('user', function($http, $state, $translate, $localStorage, $cordovaToast, $cordovaDialogs, $ionicLoading, $cordovaNetwork) {
	return {
		login: function(data, callback)
		{
			var startTime = new Date().getTime();
			$http({
				url		: rest_addr+'login',
				method	: 'POST',
				data	: data,
				timeout : 7000
			})
			.success(function(data)
			{
				if(data.errno == 1080)
				{
					$state.go('logout');
					return;
				}
				if(typeof callback == 'function') callback(data);
			})
			.error(function(data, status, headers, config)
			{
				if(!data) {
					$ionicLoading.hide();
					$cordovaToast
					    .show($translate.instant('ADD31'), 'long', 'center')
					    .then(function(success) {
					    	if(typeof callback == 'function') callback(data);
					    }, function (error) {
					     	// error
			 		});
				}
				else {
					$ionicLoading.hide();
					$cordovaDialogs.alert($translate.instant('ADD13'));
					if(typeof callback == 'function') callback(data);
				}
			});
		},
		
		getCompanyUsers: function(callback)
		{
			$http.get(rest_addr+'getcompanyusers?token='+$localStorage.token)
			.success(function(data)
			{
				if(data.errno == 1080){
					$state.go('logout');
					return;
				}
				if(typeof callback == 'function') callback(data);
			})
			.error(function(data, status, headers, config)
			{
				if(!data) {
					$ionicLoading.hide();
					$cordovaToast
					    .show($translate.instant('ADD31'), 'long', 'center')
					    .then(function(success) {
					    	if(typeof callback == 'function') callback(data);
					    }, function (error) {
					     	// error
			 		});
				}
				else {
					$ionicLoading.hide();
					$cordovaDialogs.alert($translate.instant('ADD14'));
					if(typeof callback == 'function') callback(data);
				}

				// $cordovaDialogs.alert($translate.instant('ADD14'));
				// $ionicLoading.hide();
				// if(typeof callback == 'function') callback(data);
			});
		},
		
		resetPassword: function(data, callback)
		{
			$http.get(rest_addr+'resetpassword', {params: data})
			.success(function(data)
			{
				if(typeof callback == 'function') callback(data);
			})
			.error(function(data)
			{
				if(!data) {
					$ionicLoading.hide();
					$cordovaToast
					    .show($translate.instant('ADD31'), 'long', 'center')
					    .then(function(success) {
					    	if(typeof callback == 'function') callback(data);
					    }, function (error) {
					     	// error
			 		});
				}
				else {
					$cordovaDialogs.alert($translate.instant('ADD15'));
					$ionicLoading.hide();
					if(typeof callback == 'function') callback(data);
				}
			});
		},
		
		
		updateProfile: function(data, callback){
			$http({
				url		: rest_addr+'updateruser?token='+$localStorage.token+'&id='+data.userData.id,
				method	: 'POST',
				data	: data
			})
			.success(function(data)
			{
				if(data.errno == 1080)
				{
					$state.go('logout');
					return;
				}
				if(typeof callback == 'function') callback(data);
			})
			.error(function(data, status, headers, config)
			{
				if(!data) {
					$ionicLoading.hide();
					$cordovaToast
					    .show($translate.instant('ADD31'), 'long', 'center')
					    .then(function(success) {
					    	if(typeof callback == 'function') callback(data);
					    }, function (error) {
					     	// error
			 		});
				}
				else {
					$cordovaDialogs.alert($translate.instant('ADD16'));
					$ionicLoading.hide();
					if(typeof callback == 'function') callback(data);
				}
			});
		},
	};
})

.factory('contact', function($http, $localStorage, $cordovaDialogs, $ionicLoading, $translate, $cordovaToast) {
	return {
		sendMessage: function(data, callback)
		{
			$http({
				url		: rest_addr+'sendmessage',
				method	: 'POST',
				data	: data
			})
			.success(function(data)
			{
				if(typeof callback == 'function') callback(data);
			})
			.error(function(data, status, headers, config)
			{
				if(!data) {
					$ionicLoading.hide();
					$cordovaToast
					    .show($translate.instant('ADD31'), 'long', 'center')
					    .then(function(success) {
					    	if(typeof callback == 'function') callback(data);
					    }, function (error) {
					     	// error
			 		});
				}
				else {
					$cordovaDialogs.alert($translate.instant('ADD11'));
					$ionicLoading.hide();
					if(typeof callback == 'function') callback(data);
				}
			});
		},
		
	}
})

.factory('ConnectivityMonitor', function($rootScope, $cordovaNetwork){
 
  return {
    //navigator.connection.type == Connection.NONE

    isOnline: function(){
      if(navigator.connection.type == Connection.NONE){
      	return false;
      } else {
        return true;
      }
    },
    isOffline: function(){
      if(navigator.connection.type == Connection.NONE){
      	return true;
      } else {
        return false;
      }
    },
    startWatching: function(){
        if(navigator.connection.type == Connection.NONE){
 
          $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
            console.log("went online");
          });
 
          $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
            console.log("went offline");
          });
 
        }
        else {
 
          window.addEventListener("online", function(e) {
            console.log("went online");
          }, false);    
 
          window.addEventListener("offline", function(e) {
            console.log("went offline");
          }, false);  
        }       
    }


    // isOnline: function(){
    //   if(ionic.Platform.isWebView()){
    //   	console.log("networkState", navigator.connection.type);
    //     return $cordovaNetwork.isOnline();    
    //   } else {
    //     return navigator.onLine;
    //   }
    // },
    // isOffline: function(){
    //   if(ionic.Platform.isWebView()){
    //     return !$cordovaNetwork.isOnline();    
    //   } else {
    //     return !navigator.onLine;
    //   }
    // },
    // startWatching: function(){
    //     if(ionic.Platform.isWebView()){
 
    //       $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
    //         console.log("went online");
    //       });
 
    //       $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
    //         console.log("went offline");
    //       });
 
    //     }
    //     else {
 
    //       window.addEventListener("online", function(e) {
    //         console.log("went online");
    //       }, false);    
 
    //       window.addEventListener("offline", function(e) {
    //         console.log("went offline");
    //       }, false);  
    //     }       
    // }
  }
})

.factory('observation', function($http, $state, $localStorage, $cordovaDialogs, $ionicLoading, $httpParamSerializer, $cordovaNetwork, $translate, $cordovaToast) {
	return {
		checkUpdate: function(callback)
		{
			dataParams			= {};
			dataParams.token 	= $localStorage.token;
			$http.get(rest_addr+'checklistupdate', {params:dataParams})
			.success(function(data)
			{
				if(data.errno == 1080)
				{
					$state.go('logout');
					return;
				}
				if(typeof callback == 'function') callback(data);
			})
			.error(function(data, status, headers, config)
			{
				$ionicLoading.hide();
				if(typeof callback == 'function') callback(data);	
				// if(!data) {
				// 	$ionicLoading.hide();
				// 	$cordovaToast
				// 	    .show($translate.instant('ADD31'), 'long', 'center')
				// 	    .then(function(success) {
				// 	    	if(typeof callback == 'function') callback(data);
				// 	    }, function (error) {
				// 	     	// error
			 // 		});
				// }
				// else {
				// 	$ionicLoading.hide();
				// 	if(typeof callback == 'function') callback(data);
				// }
			});
		},
		
		getLocations: function(callback)
		{
			$http.get(rest_addr+'getlocations?cid='+$localStorage.userData.cid+'&type=mobile&token='+$localStorage.token, {timeout: 25000})
			.success(function(data)
			{
				if(typeof callback == 'function') callback(data);
			})
			.error(function(data, status, headers, config)
			{
				$ionicLoading.hide();
				if(typeof callback == 'function') callback(data);
				// if(!data) {
				// 	$ionicLoading.hide();
				// 	$cordovaToast
				// 	    .show($translate.instant('ADD31'), 'long', 'center')
				// 	    .then(function(success) {
				// 	    	if(typeof callback == 'function') callback(data);
				// 	    }, function (error) {
				// 	     	// error
			 // 		});
				// }
				// else {
				// 	$ionicLoading.hide();
				// 	if(typeof callback == 'function') callback(data);
				// }
			});
		},
		
		saveObservation: function(data, callback)
		{
			if($cordovaNetwork.isOffline())
			//if(1 == 1)
			{
				var data = {status:1, offline:true, message: ''};
				if(typeof callback == 'function') callback(data);
				return;
			}	
			
			$http({
				url		: rest_addr+'saveobservation?token='+$localStorage.token,
				method	: 'POST',
				data	: data,
				timeout: 7000
			})
			.success(function(data)
			{
				if(data.errno == 1080)
				{
					$state.go('logout');
					return;
				}
				
				data.offline = false;
				if(typeof callback == 'function') callback(data);
			})
			.error(function(data, status, headers, config)
			{
				if(!data) {
					$ionicLoading.hide();
					var data = {status:1, offline:true, message: ''};
					if(typeof callback == 'function') callback(data);
					return;
				}
				else {
					$ionicLoading.hide();
					if(typeof callback == 'function') callback(data);
				}
			});
		},
		
		
		multiObserveSend: function(data, callback)
		{
			//RONALD: Conflicting when trying to resend observations when ID:1 is passed
			delete data['id'];
			//if(1 == 1)				
			if($cordovaNetwork.isOffline())
			{
				var data = {status:1, offline:true, message: ''};
				if(typeof callback == 'function') callback(data);
				return;
			}	
			
			$http({
				url		: rest_addr+'multiobservesend?token='+$localStorage.token,
				method	: 'POST',
				data	: data,
				timeout: 3000
			})
			.success(function(data)
			{
				if(data.errno == 1080)
				{
					$state.go('logout');
					return;
				}
				data.offline = false;
				data.message = $translate.instant('AG23');
				if(typeof callback == 'function') callback(data);
			})
			.error(function(data, status, headers, config)
			{
				// if(!data) {
					$ionicLoading.hide();
					var data1 = {status:1, offline:true, message: $translate.instant('ADD32')};
					if(typeof callback == 'function') callback(data1);
					return;
				// }
				// else {
				// 	$ionicLoading.hide();
				// 	if(typeof callback == 'function') callback(data);
				// }
			});
		},
		
		
		getReports: function(dataParams, callback)
		{
			
			dataParams.token 	= $localStorage.token;
			//console.log($httpParamSerializer(dataParams))
			// console.log(rest_addr+'getobservation');
			console.log(dataParams);
			$http.get(rest_addr+'getobservation', {params:dataParams})
			.success(function(data)
			{
				if(data.errno == 1080)
				{
					$state.go('logout');
					return;
				}
				if(typeof callback == 'function') callback(data);
			})
			.error(function(data, status, headers, config)
			{
				if(!data) {
					$ionicLoading.hide();
					$cordovaToast
					    .show($translate.instant('ADD31'), 'long', 'center')
					    .then(function(success) {
					    	$state.go('app.home');
					    	//if(typeof callback == 'function') callback(data);
					    }, function (error) {
					     	// error
			 		});
				}
				else {
					$cordovaDialogs.alert($translate.instant('ADD17'));
					$ionicLoading.hide();
					if(typeof callback == 'function') callback(data);
				}
			});
		},
		
		sendMailReports: function(data, callback)
		{
			$http({
				url		: rest_addr+'mailreports?token='+$localStorage.token,
				method	: 'POST',
				data	: {'data':JSON.stringify(data)}
			})
			.success(function(data)
			{
				if(data.errno == 1080)
				{
					$state.go('logout');
					return;
				}
				if(typeof callback == 'function') callback(data);
			})
			.error(function(data, status, headers, config)
			{
				if(!data) {
					$ionicLoading.hide();
					$cordovaToast
					    .show($translate.instant('ADD31'), 'long', 'center')
					    .then(function(success) {
					    	$state.go('app.home');
					    	//if(typeof callback == 'function') callback(data);
					    }, function (error) {
					     	// error
			 		});
				}
				else {
					$cordovaDialogs.alert($translate.instant('ADD18'));
					$ionicLoading.hide();
					if(typeof callback == 'function') callback(data);
				}
			});
		},
		
		getStatistics: function(dataParams,callback)
		{
			dataParams.token 	= $localStorage.token;
			// dataParams.uid 		= $localStorage.userData.id;
			dataParams.uid = dataParams.auditor;
		
			console.log("getStatistics");
			console.log(dataParams.auditor);

			$http.get(rest_addr+'getstatistics',{params:dataParams})
			.success(function(data)
			{
				if(data.errno == 1080)
				{
					$state.go('logout');
					return;
				}
				if(typeof callback == 'function') callback(data);
			})
			.error(function(data, status, headers, config)
			{
				if(!data) {
					$ionicLoading.hide();
					$cordovaToast
					    .show($translate.instant('ADD31'), 'long', 'center')
					    .then(function(success) {
					    	$state.go('app.home');
					    	//if(typeof callback == 'function') callback(data);
					    }, function (error) {
					     	// error
			 		});
				}
				else {
					//$cordovaDialogs.alert($translate.instant('ADD17'));
					$ionicLoading.hide();
					if(typeof callback == 'function') callback(data);
				}
			});
		},
	}
})