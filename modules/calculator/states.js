/**
 * Nos routes ui-router
 */
angular.module('calculator').config(['$stateProvider', '$urlRouterProvider', "$locationProvider", function ($stateProvider, $urlRouterProvider, $locationProvider) {


  if(window.history && window.history.pushState) {
    $locationProvider.html5Mode({
      enabled: true, requireBase:false
    });
  }


  $stateProvider.state('calculator', {
    url: '/',
    templateUrl: "modules/calculator/views/calculator.html",
    controller:'chargesReportController'
  });

}]);



