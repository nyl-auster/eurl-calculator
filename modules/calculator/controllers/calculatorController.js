angular.module('calculator').controller('calculatorController', ['$scope',  'calculatorService', function ($scope, calculatorService) {

  $scope.totalCharges = 0;
  $scope.totalAProvisionner = 0;
  $scope.tva = 0;
  $scope.cfe = 500;
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

    let lines = [];

    lines = lines
      .concat(getLinesCotisationsSociales())
      .concat(calculatorService.impotSurLesSocietes($scope.form.chiffreAffaireHt))
      .concat(calculatorService.tvaNormale($scope.form.chiffreAffaireHt));

    // ajout de la ligne CFE
    lines.push({
      charge: {
        label:'CFE'
      },
      montant: $scope.form.cfe
    });

    // ajout de la ligne frais
    lines.push({
      charge: {
        label:'Frais'
      },
      montant: $scope.form.frais
    });

    $scope.totalAProvisionner = getTotalFromLines(lines);

    $scope.benefice = calculerBenefice($scope.totalAProvisionner);

    $scope.lines = lines;
  }


  function calculerBenefice(totalAprovisionner) {
    return parseFloat($scope.form.chiffreAffaireHt)
      - totalAprovisionner
      - parseFloat($scope.form.remuneration);
  }

  function getTotalAProvisionner() {
    let totalCotisationsSociales = getTotalFromLines(getLinesCotisationsSociales());
    let TVA = calculatorService.tvaNormale($scope.form.chiffreAffaireHt).montant;
    let total = parseFloat($scope.form.cfe)
      + parseFloat($scope.form.frais)
      + TVA
      + totalCotisationsSociales;

    console.log(total);
    return total;
  }

  function getTotalFromLines(lines) {
    totalCharges = 0;
    lines.forEach(function(charge){
      totalCharges += parseFloat(charge.montant);
    });
    return totalCharges;
  }

  /**
   *
   * @returns {Array}
   */
  function getLinesCotisationsSociales() {
    return [
      calculatorService.assuranceVieillesseBase($scope.form.remuneration),
      calculatorService.assuranceVieillesseComplementaire($scope.form.remuneration),
      calculatorService.formationProfessionnelle($scope.form.remuneration),
      calculatorService.allocationsFamiliales($scope.form.remuneration),
      calculatorService.maladiesMaternite($scope.form.remuneration)
    ];
  }

}]);



