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
    chiffreAffaireHt: 0,
    chiffreAffaireTtc: 0,
    remuneration: 0,
    frais: 0,
    tva:0,
    cfe: 500,
    prevoyance:'B'
  };
  $scope.showDetails = 0;
  $scope.showFormHelp = 0;

  $scope.plafondMax = chargesConfig2016.plafondMax;
  $scope.chargesConfig = chargesConfig2016;

  // rafraichir les résultats
  $scope.refreshResults = () => {
    getResults();
  };

  $scope.reportTvaHelper = () => {
    $scope.form.tva = $scope.form.chiffreAffaireHt * 0.20;
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


    // textos
    // 1 - le chiffre d'affaire TTC, fruit des ventes de la société
    $scope.texto1Montant = calculator.chiffreAffaireTtc;

    // 2 - on retranche nos frais
    $scope.texto2Montant = calculator.frais;

    // 3 - on met à jour le reste à banque
    $scope.texto3Montant = $scope.texto1Montant - calculator.frais;

    // 2 - on retranche la TVA à reverser
    $scope.texto4Montant = calculator.tva;

    // 3 - on met à jour le reste à banque
    $scope.texto5Montant = $scope.texto3Montant - $scope.texto4Montant;

    // 4 - le dirigeant prend sa rémunération
    $scope.texto6Montant = calculator.remuneration;

    // on met à jour le reste en banque
    $scope.texto7Montant = $scope.texto5Montant - $scope.texto6Montant;

    // l'état prend des cotisations sur la rémunération du dirigeant
    $scope.texto8Montant = calculator.getTotalCotisationsSociales().montant;

    // on met à jour le reste en banque
    $scope.texto9Montant = $scope.texto7Montant - $scope.texto8Montant;

    // la CFE
    $scope.texto10Montant = calculator.cfe;

    // on met à jour le reste en banque
    $scope.texto11Montant = $scope.texto9Montant - $scope.texto10Montant;

    // l'impôt sur les sociétés
    $scope.texto12Montant = calculator.getImpotSurLesSocietes().montant;

    // on met à jour le reste en banque
    $scope.texto13Montant = $scope.texto11Montant - $scope.texto12Montant;


    // ajout du total à provisionner
    charges.push(getChargesTotal(charges));

    // on rafraichit le scope avec les données retournées par le calculateur
    $scope.charges = charges;

    // graphique 1
    $scope.pie = {labels:[], data:[]};
    $scope.pie.labels = [
      "Bénéfice",
      "Rémunération",
      "Chiffre d'affaire HT"
    ];
    $scope.pie.data = [
      calculator.getBenefice().montant,
      calculator.remuneration,
      calculator.chiffreAffaireHt
    ];

    // graphique 2
    $scope.pieCotisations = {labels:[], data:[]};
    $scope.pieCotisations.labels = [
      "Rémunération",
      "Cotisations sociales"
    ];
    $scope.pieCotisations.data = [
      calculator.remuneration,
      calculator.getTotalCotisationsSociales().montant
    ];

  }

}]);



