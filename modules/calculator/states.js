/**
 * Config. On déclare notamment nos routes ici.
 */

angular.module('calculator').config(['$stateProvider', '$urlRouterProvider', 'coreSettings', function ($stateProvider, $urlRouterProvider, coreSettings) {

  $stateProvider.state('calculator', {
    url: '/',
    templateUrl: coreSettings.modulesPath + "/calculator/views/calculator.html",
    controller:'calculatorController'
  });

}]);



