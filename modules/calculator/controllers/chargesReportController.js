/**
 * Affichage du cout des charges d'une EURL à l'IS
 * Objet "charge" > objet "Resultat du calculator" > objet "ligne à afficher"
 */
angular.module('calculator').controller('chargesReportController', ['$scope', 'chargesCalculatorService', 'chargesConfig', '$cookies', function ($scope, chargesCalculatorService, $cookies, chargesConfig) {

  $scope.totalAProvisionner = 0;
  $scope.benefice = 0;
  $scope.form = {
    remuneration: 0,
    chiffreAffaireHt: 0,
    frais: 0,
    cfe: 500
  };
  $scope.showDetails = 0;

  // rafraichir les résultats
  $scope.refreshResults = function() {
    getResults();
  };

  getResults();

  function getResults() {

    calculator = chargesCalculatorService($scope.form);

    let charges = [];

    charges = charges
      .concat(calculator.getCotisationsSocialesArray())
      .concat(calculator.getImpotSurLesSocietes())
      .concat(calculator.getTva20())
      .concat(calculator.getCfe())
      .concat(calculator.getFrais());

    console.log(charges);

    $scope.totalAProvisionner = calculator.getTotalAProvisionner();

    $scope.benefice = calculator.getBenefice();

    $scope.charges = charges;
  }



}]);



