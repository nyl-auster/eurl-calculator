/**
 * Affichage du cout des charges d'une EURL à l'IS
 * Objet "charge" > objet "Resultat du calculator" > objet "ligne à afficher"
 */
angular.module('calculator').controller('chargesReportController', ['$scope', 'chargesCalculatorService', '$cookies','chargesConfig2016', function ($scope, chargesCalculatorService, $cookies, chargesConfig2016) {

  $scope.totalAProvisionner = 0;
  $scope.benefice = 0;
  $scope.form = {
    chiffreAffaireHt: 50000,
    remuneration: 30000,
    tva:0,
    frais: 0,
    cfe: 500
  };
  $scope.showDetails = 1;

  $scope.plafondMax = chargesConfig2016.plafondMax;

  // rafraichir les résultats
  $scope.refreshResults = () => {
    getResults();
  };

  $scope.reportTvaHelper = () => {
    $scope.form.tva = $scope.form.chiffreAffaireHt * 0.20;
    getResults();
  };

  getResults();

  function getResults() {

    calculator = chargesCalculatorService($scope.form);

    let charges = [];
    charges = charges
      .concat(calculator.getCotisationsSocialesArray())
      .concat(calculator.getImpotSurLesSocietes())
      .concat(calculator.getTva())
      .concat(calculator.getCfe())
      .concat(calculator.getFrais());

    // on rafraichit le scope avec les données retournées par le calculateur
    $scope.totalAProvisionner = calculator.getTotalAProvisionner();
    $scope.benefice = calculator.getBenefice();
    $scope.chiffreAffaireTtc = calculator.caculerChiffreAffaireTtc();
    $scope.charges = charges;
  }

}]);



