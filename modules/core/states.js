/**
 * Déclaration des status pour le module ui-router
 */

angular.module('core').config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$urlMatcherFactoryProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider) {

  // activer le mode html 5
  if(window.history && window.history.pushState) {
    $locationProvider.html5Mode({
      enabled: true, requireBase:false
    });
  }

  $urlMatcherFactoryProvider.strictMode(false);

  // en cas de route non trouvée, rediriger sur la page d'accueil
  $urlRouterProvider.otherwise('/');


}]);
