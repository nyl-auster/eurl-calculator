/**
 * Config. On déclare notamment nos routes ici.
 */
var module = angular.module('calculatorApp');

module.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

  // en cas de route non trouvée, rediriger sur la page d'accueil
  $urlRouterProvider.otherwise('/');

  $stateProvider.state('index', {
    url: '/',
    templateUrl: "modules/calculator/views/index.html",
    controller:'indexController'
  });

}]);



