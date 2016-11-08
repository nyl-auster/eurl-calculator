/**
 * Config. On déclare notamment nos routes ici.
 */

angular.module('calculator').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state('calculator', {
    url: '/',
    templateUrl: "src/calculator/views/index.html",
    controller:'indexController'
  });

}]);



