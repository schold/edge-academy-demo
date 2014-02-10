'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MyCtrl1', ['$scope', '$http', function($scope, $http) {
  	$scope.order = function(predicate) {
  		if (predicate === $scope.predicate) {
  			$scope.predicate = "-"+predicate;
  		} else {
  			$scope.predicate = predicate;
  		}
  	};

  	$scope.getMedals = function() {
		$http.get("/medals").success(function(data) {
	  		$scope.data = data;
	  	});
  	};
  	

  }]);