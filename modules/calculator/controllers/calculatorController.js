angular.module('calculator').controller('calculatorController', ['$scope',  'calculatorService', function ($scope, calculatorService) {

  var calculette = calculatorService;

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

  $scope.calculerResultats = function() {
    calculerResultats();
  }

  calculerResultats();

  function calculerTva() {
    $scope.tva = $scope.form.chiffreAffaireHt * 0.20;
  }

  function calculerBenefice() {
    $scope.benefice = $scope.form.chiffreAffaireHt
    - $scope.form.remuneration
    - $scope.totalAProvisionner;
  }

  function calculerTotalAProvisionner() {
    $scope.totalAProvisionner = parseFloat($scope.tva)
    + parseFloat($scope.totalCharges)
    + parseFloat($scope.form.cfe);
  }

  function calculerTotalCharges() {
    $scope.charges.forEach(function(charge){
      $scope.totalCharges += parseFloat(charge.montant);
    });
  };

  function calculerCharges() {

    var charges = [];

    //@FIXME vérifier les bases de calcul
    charges.push(calculette.assuranceVieillesseBase($scope.form.remuneration));
    charges.push(calculette.allocationsFamiliales($scope.form.remuneration));
    charges.push(calculette.assuranceVieillesseComplementaire($scope.form.remuneration));
    charges.push(calculette.formationProfessionnelle($scope.form.remuneration));
    charges.push(calculette.allocationsFamiliales($scope.form.remuneration));
    charges.push(calculette.maladiesMaternite($scope.form.remuneration));
    charges.push(calculette.impotSurLesSocietes($scope.form.chiffreAffaireHt));

    $scope.charges = charges;

  }

  function calculerResultats() {
    calculerCharges();
    calculerTotalCharges();
    calculerTva();
    calculerTotalAProvisionner();
    calculerBenefice();
  }

}]);



