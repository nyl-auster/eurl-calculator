angular.module('calculator').directive('calculatorTableLine', ['coreConfig', function(coreConfig){
  return {
    restrict: 'AE',
    scope: {
      result: '='
    },
    templateUrl : coreConfig.modulesPath + '/calculator/directives/calculatorTableLine/calculatorTableLine.html',
    controller:['$scope', 'calculatorConfig', function($scope, calculatorConfig){
      console.log($scope.result);
      // remplacer la valeur plafond max par une valeur de type vide au moment de l'affichage
      $scope.result.tranches.forEach(function(tranche){
        if (tranche.plafond == calculatorConfig.plafondMax ) {
          tranche.plafond = ' - ';
        }
      });
    }]
  };
}]);