/**
 * Nos routes ui-router
 */
angular.module('calculator').config(['$stateProvider', '$urlRouterProvider', "ChartJsProvider", function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state('calculator', {
    url: '/',
    templateUrl: "modules/calculator/views/calculator.html",
    controller:'chargesReportController'
  });

}]);



