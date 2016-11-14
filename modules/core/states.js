/**
 * Déclaration des status pour le module ui-router
 */

angular.module('core').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

  // en cas de route non trouvée, rediriger sur la page d'accueil
  $urlRouterProvider.otherwise('/');

}]);
