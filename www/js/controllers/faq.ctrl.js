angular.module('faq.ctrl', [])

.controller('faqCtrl', function($scope, $state, $stateParams, $localStorage, $translate){
	if(!$localStorage.userData) $state.go('login');
	
	$scope.faqs = [
		{
			q:$translate.instant('J1'),
			a:$translate.instant('J2')
		},
		{
			q:$translate.instant('J3'),
			a:$translate.instant('J4')
		},
		{
			q:$translate.instant('J5'),
			a:$translate.instant('J6')
		},
		{
			q:$translate.instant('J7'),
			a:$translate.instant('J8')
		},
		{
			q:$translate.instant('J9'),
			a:$translate.instant('J10')
				+'<br>'+$translate.instant('J11')
				+'<br><br>'+$translate.instant('J12')
				+'<br><br>'+$translate.instant('J13')
		},
		{
			q:$translate.instant('J14'),
			a:$translate.instant('J15')
		},
		{
			q:$translate.instant('J16'),
			a:$translate.instant('J17')
		},
		{
			q:$translate.instant('J18'),
			a:$translate.instant('J19')
		}
	];
	
	$scope.viewFaq = function(id)
	{
		$state.go('app.faqitem', {'id':id});
	}
	
	if($state.current.name == 'app.faqitem')
	{
		$scope.faqItem = $scope.faqs[$stateParams.id];
	}
	//
})