angular.module('calculator').controller('calculatorController', ['$scope',  'calculatorConfig', 'calculatorService', function ($scope, calculatorConfig, calculatorService) {

  var calculator = calculatorService;
  var parametres = calculatorConfig;

  $scope.form = {
    remuneration: 0,
    chiffreAffaire: 0
  };


  console.log(parametres);
  console.log(calculator);

}]);



