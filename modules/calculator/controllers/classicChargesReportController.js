/**
 * @FIXME ajout CGS CRD, controle de toutes les charges
 *
 * Affichage du cout des charges d'une EURL à l'IS
 * Objet "charge" > objet "Resultat du calculator" > objet "ligne à afficher"
 */
angular.module('calculator').controller('classicChargesReportController', ['$scope', 'chargesCalculatorService', '$cookies','chargesConfig2016', function ($scope, chargesCalculatorService, $cookies, chargesConfig2016) {

  $scope.totalAProvisionner = 0;
  $scope.benefice = 0;
  $scope.form = {
    chiffreAffaireHt: 0,
    chiffreAffaireTtc: 0,
    remuneration: 0,
    tva:0,
    fraisTtc: 0,
    fraisHt: 0,
    cfe: 500,
    prevoyance:'B'
  };
  $scope.showDetails = 0;
  $scope.showFormHelp = 1;

  $scope.plafondMax = chargesConfig2016.plafondMax;
  $scope.chargesConfig = chargesConfig2016;

  // rafraichir les résultats
  $scope.refreshResults = () => {
    getResults();
  };

  getResults();

  function getChargesTotal(lines) {
    var total = 0;
    lines.forEach(function(line) {
      total += line.montant;
    });
    return {
      label: "TOTAL A PROVISIONNER",
      montant:total
    };
  }

  function getResults() {

    let calculator = chargesCalculatorService($scope.form);
    $scope.calculator = calculator;

    let charges = [];
    charges = charges.concat(calculator.getCotisationsSocialesArray());
    charges.push(calculator.getCgsCrds());
    charges.push(calculator.getPrevoyance());
    charges.push(calculator.getImpotSurLesSocietes());
    charges.push(calculator.getTva());
    charges.push(calculator.getCfe());

    // ajout du total à provisionner
    charges.push(getChargesTotal(charges));

    // on rafraichit le scope avec les données retournées par le calculateur
    $scope.charges = charges;

  }

}]);



