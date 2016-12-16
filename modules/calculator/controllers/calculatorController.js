angular.module('calculator').controller('calculatorController', ['$scope', 'chargesCalculator', '$cookies', function ($scope, chargesCalculator, $cookies) {

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

  function getBaseCalculIs() {
    return $scope.form.chiffreAffaireHt
      - $scope.form.remuneration
      - $scope.form.frais;
  }

  function getResults() {

    let lines = [];

    var baseCalculIS = $scope.form.chiffreAffaireHt - $scope.form.frais - $scope.form.cfe;

    lines = lines
      .concat(getLinesCotisationsSociales())
      .concat(chargesCalculator.impotSurLesSocietes(getBaseCalculIs()))
      .concat(chargesCalculator.tvaNormale($scope.form.chiffreAffaireHt));

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
    // comme on compte la TVA dans notre total à provisionner, on doit partir
    // du CA TTC pour calculer notre restant une fois retranché
    // la rémunération et le total à provisionner
    const CATTC = parseFloat($scope.form.chiffreAffaireHt) + chargesCalculator.tvaNormale($scope.form.chiffreAffaireHt).montant;
    return CATTC - totalAprovisionner - parseFloat($scope.form.remuneration);
  }

  function getTotalAProvisionner() {
    let totalCotisationsSociales = getTotalFromLines(getLinesCotisationsSociales());
    let TVA = chargesCalculator.tvaNormale($scope.form.chiffreAffaireHt).montant;
    let total = parseFloat($scope.form.cfe)
      + parseFloat($scope.form.frais)
      + TVA
      + totalCotisationsSociales;
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
      chargesCalculator.assuranceVieillesseBase($scope.form.remuneration),
      chargesCalculator.assuranceVieillesseComplementaire($scope.form.remuneration),
      chargesCalculator.formationProfessionnelle($scope.form.remuneration),
      chargesCalculator.allocationsFamiliales($scope.form.remuneration),
      chargesCalculator.maladiesMaternite($scope.form.remuneration)
    ];
  }

}]);



