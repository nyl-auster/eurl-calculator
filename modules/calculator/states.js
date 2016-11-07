/**
 * Config. On déclare notamment nos routes ici.
 */
module.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

  // en cas de route non trouvée, rediriger sur la page d'accueil
  $urlRouterProvider.otherwise('/');

  $stateProvider.state('test', {
    url: '/test',
    templateUrl: "modules/calculatorApp/views/index.html",
    controller:'indexController'
  });

}]);



