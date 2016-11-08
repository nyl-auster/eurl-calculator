angular.module('calculator').controller('calculatorController', ['$scope',  'calculatorConfig', 'calculatorService', function ($scope, calculatorConfig, calculatorService) {

  var calculette = calculatorService;
  var parametres = calculatorConfig;

  $scope.form = {
    remuneration: 0,
    chiffreAffaire: 0
  };

  $scope.rafraichirResultats = function() {
    $scope.assuranceVieillesseComplementaire = calculette.assuranceVieillesseComplementaire($scope.form.remuneration);
  }


}]);



