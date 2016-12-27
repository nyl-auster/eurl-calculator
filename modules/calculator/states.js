/**
 * Nos routes ui-router
 */
angular.module('calculator').config(['$stateProvider', '$urlRouterProvider', "$locationProvider", '$urlMatcherFactoryProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider) {

  $stateProvider.state('classic', {
    url: '/',
    templateUrl: "/modules/calculator/views/classicChargesReport.html",
    controller:'classicChargesReportController'
  });

  $stateProvider.state('story', {
    url: '/story',
    templateUrl: "/modules/calculator/views/storyChargesReport.html",
    controller:'storyChargesReportController'
  });

}]);



