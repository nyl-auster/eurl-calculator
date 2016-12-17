/**
 * @FIXME ajout CGS CRD, controle de toutes les charges
 *
 * Affichage du cout des charges d'une EURL à l'IS
 * Objet "charge" > objet "Resultat du calculator" > objet "ligne à afficher"
 */
angular.module('calculator').controller('chargesReportController', ['$scope', 'chargesCalculatorService', '$cookies','chargesConfig2016', function ($scope, chargesCalculatorService, $cookies, chargesConfig2016) {

  $scope.totalAProvisionner = 0;
  $scope.benefice = 0;
  $scope.form = {
    chiffreAffaireHt: 35000,
    remuneration: 15000,
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

    $scope.calculator = calculator = chargesCalculatorService($scope.form);


    let charges = [];
    charges = charges
      .concat(calculator.getCotisationsSocialesArray())
      .concat(calculator.getImpotSurLesSocietes())
      .concat(calculator.getTva())
      .concat(calculator.getCfe())
      .concat(calculator.getFrais());

    aProvisionner = [];
    aProvisionner = aProvisionner
      .concat(calculator.getTotalAProvisionner())
      .concat(calculator.getTotalCotisationsSociales())
      .concat(calculator.getImpotSurLesSocietes())
      .concat(calculator.getCfe())
      .concat(calculator.getTva())
      .concat(calculator.getBenefice());

    console.log(aProvisionner);

    $scope.pie = {labels:[], data:[]};
    $scope.pie.labels = [
      "Bénéfice",
      "Chiffre d'affaire TTC"
    ];
    $scope.pie.data = [
      calculator.getBenefice().montant,
      calculator.getChiffreAffaireTtc().montant
    ];

    // on rafraichit le scope avec les données retournées par le calculateur
    $scope.charges = charges;
    $scope.aProvisionner = aProvisionner;

  }

}]);



