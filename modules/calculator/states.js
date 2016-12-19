/**
 * Nos routes ui-router
 */
angular.module('calculator').config(['$stateProvider', '$urlRouterProvider', "$locationProvider", '$urlMatcherFactoryProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider) {

  $urlMatcherFactoryProvider.strictMode(false);

  $stateProvider.state('simple', {
    url: '/',
    templateUrl: "modules/calculator/views/calculator.html",
    controller:'chargesReportController'
  });

  $stateProvider.state('classic', {
    url: '/classic',
    templateUrl: "modules/calculator/views/classicChargesReport.html",
    controller:'classicChargesReportController'
  });

}]);



