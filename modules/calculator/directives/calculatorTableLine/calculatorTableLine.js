angular.module('calculator').directive('calculatorTableLine', ['coreConfig', function(coreConfig){
  return {
    scope: {
      test: '=',
      details: 'details'
    },
    templateUrl : coreConfig.modulesPath + '/calculator/directives/calculatorTableLine/calculatorTableLine.html',
  };
}]);
