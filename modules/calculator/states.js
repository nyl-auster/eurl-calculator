/**
 * Config. On déclare notamment nos routes ici.
 */
angular.module('calculator').config(['$stateProvider', '$urlRouterProvider', 'coreConfig', function ($stateProvider, $urlRouterProvider, coreConfig) {

  $stateProvider.state('calculator', {
    url: '/',
    templateUrl: coreConfig.modulesPath + "/calculator/views/calculator.html",
    controller:'calculatorController'
  });

}]);



