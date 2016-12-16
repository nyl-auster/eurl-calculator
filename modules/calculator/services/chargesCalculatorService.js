/**
 * Calculs des charges d'une EULR en fonction des paramètres
 */
angular.module('calculator').service('chargesCalculatorService',['chargesConfig', 'chargesTranchesCalculatorService', function(chargesConfig, chargesTranchesCalculatorService){

  const service = {};

  /**
   * Calcul des cotisations maladie et maternité - URSSAF
   */
  service.assuranceVieillesseComplementaire = function(baseCalcul) {
    return chargesTranchesCalculatorService.calculerTrancheExclusive(baseCalcul, chargesConfig.charges.assuranceVieillesseComplementaire);
  };

  /**
   * Calcul des cotisations pour la formation professionnelle
   */
  service.formationProfessionnelle = function(baseCalcul) {
    return chargesTranchesCalculatorService.calculerTrancheExclusive(baseCalcul, chargesConfig.charges.formationProfessionnelle);
  };

  /**
   * Calcul des cotisations maladie et maternité - URSSAF
   */
  service.allocationsFamiliales = function(baseCalcul) {
    return chargesTranchesCalculatorService.calculerTrancheExclusive(baseCalcul, chargesConfig.charges.allocationsFamiliales);
  };

  /**
   * Calcul des cotisations maladie et maternité - CIPAV
   * @FIXME calcul chelou, à vérifier
   */
  service.assuranceVieillesseBase = function(baseCalcul) {
    var assuranceVieillesseBase = angular.copy(chargesConfig.charges.assuranceVieillesseBase);
    if (baseCalcul > assuranceVieillesseBase.tranches[0].plafond) {
      delete assuranceVieillesseBase.tranches[0];
    }
    var result = chargesTranchesCalculatorService.calculerTranchesCumulatives(baseCalcul, assuranceVieillesseBase);
    return result;
  };

  /**
   * Calcul des cotisations maladie et maternité - URSSAF
   */
  service.maladiesMaternite = function(baseCalcul) {
    return chargesTranchesCalculatorService.calculerTrancheExclusive(baseCalcul, chargesConfig.charges.maladiesMaternite);
  };

  /**
   * Calcul de l'impot sur les bénéfices - Impots
   */
  service.impotSurLesSocietes = function(baseCalcul) {
    return chargesTranchesCalculatorService.calculerTranchesCumulatives(baseCalcul, chargesConfig.charges.impotSurLesSocietes);
  };

  service.tvaNormale = function(baseCalcul) {
    return chargesTranchesCalculatorService.calculerTranchesCumulatives(baseCalcul, chargesConfig.charges.tvaNormale);
  };

  return service;

}]);

