/**
 * Déclaration des status pour le module ui-router
 */

angular.module('site').config(['$stateProvider','$urlRouterProvider','$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {

  // en cas de route non trouvée, rediriger sur la page d'accueil
  $urlRouterProvider.otherwise('/');

  // activer le mode html 5
  if(window.history && window.history.pushState) {
    $locationProvider.html5Mode({
      enabled: true, requireBase:false
    });
  }

  $stateProvider.state('contact', {
    url: '/contact',
    templateUrl: "/modules/site/views/contact.html",
    controller:'contactController'
  });

  $stateProvider.state('apropos', {
    url: '/apropos',
    templateUrl: "/modules/site/views/apropos.html",
    controller:'aproposController'
  });

  $stateProvider.state('aide', {
    url: '/aide',
    templateUrl: "/modules/site/views/aide.html",
    controller:'aideController'
  });

}]);
