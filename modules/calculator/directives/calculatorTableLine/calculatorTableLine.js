angular.module('calculator').directive('calculatorTableLine', ['coreConfig', function(coreConfig){
  return {
    restrict: 'AE',
    scope: {
      result: '='
    },
    templateUrl : coreConfig.modulesPath + '/calculator/directives/calculatorTableLine/calculatorTableLine.html',
    controller:['$scope', 'calculatorConfig', function($scope, calculatorConfig) {

    }]
  };
}]);