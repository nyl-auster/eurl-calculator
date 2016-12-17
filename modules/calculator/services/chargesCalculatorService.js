/**
 * Calculs des charges d'une EULR en fonction des paramètres
 */
angular.module('calculator').service('chargesCalculatorService',['chargesConfig', 'chargesTranchesCalculatorService', function(chargesConfig, chargesTranchesCalculatorService){

  /**
   * @param params object avec les propriétés suivantes:
   *
   * - chiffreAffaire
   * - remuneration
   * - frais
   * - cfe
   */
  return function(params) {

    const service = {};

    var {chiffreAffaireHt = 0, remuneration = 0, frais = 0, cfe = 0} = params;

    service.getBaseCalculIs = function() {
      return chiffreAffaireHt - remuneration - frais;
    };

    service.getCfe = function() {
      // "pseudo" calcul : on fait ça juste pour récupérer les meta-données déjà définies
      // dans la configuration des charges (l'objet charge avec son label, son commentaire etc ...)
      var charge = chargesTranchesCalculatorService.calculerTrancheExclusive(0, chargesConfig.charges.cfe);
      charge.montant = cfe;
      return charge;
    };

    service.getFrais = function() {
      return {
        label: 'Frais',
        montant:frais
      };
    };

    service.getBenefice = function(){
      // comme on compte la TVA dans notre total à provisionner, on doit partir
      // du CA TTC pour calculer notre restant une fois retranché
      // la rémunération et le total à provisionner
      const CATTC = chiffreAffaireHt + service.getTva20();
      return CATTC - service.getTotalAProvisionner() - remuneration;
    };

    service.getCotisationsSocialesArray = function() {
      return [
        service.getAssuranceVieillesseBase(remuneration),
        service.getAssuranceVieillesseComplementaire(remuneration),
        service.getFormationProfessionnelle(remuneration),
        service.getAllocationsFamiliales(remuneration),
        service.getMaladiesMaternite(remuneration)
      ];
    };

    /**
     * Obtenir le montant total des cotisations sociales
     * @returns {number}
     */
    service.getTotalCotisationsSociales = function() {
      var total = 0;
      service.getCotisationsSocialesArray().forEach(item => total += item.montant);
      return total;
    };

    /**
     * Le total a provisionner , c'est à dire ce qui sera payé à l'état
     * à un moement donné.
     * @returns {*}
     */
    service.getTotalAProvisionner = function() {
      let totalCotisationsSociales = service.getTotalCotisationsSociales();
      let TVA = service.getTva20().montant;
      let total = cfe + TVA + totalCotisationsSociales;
      return total;
    };

    /**
     * Retourne la TVA à 20%
     * @returns {number}
     */
    service.getTva20 = function () {
      return chargesTranchesCalculatorService.calculerTrancheExclusive(chiffreAffaireHt, chargesConfig.charges.tva20);
    };

    /**
     * Calcul des cotisations maladie et maternité - URSSAF
     */
    service.getAssuranceVieillesseComplementaire = function (baseCalcul) {
      return chargesTranchesCalculatorService.calculerTrancheExclusive(baseCalcul, chargesConfig.charges.assuranceVieillesseComplementaire);
    };

    /**
     * Calcul des cotisations pour la formation professionnelle
     */
    service.getFormationProfessionnelle = function (baseCalcul) {
      return chargesTranchesCalculatorService.calculerTrancheExclusive(baseCalcul, chargesConfig.charges.formationProfessionnelle);
    };

    /**
     * Calcul des cotisations maladie et maternité - URSSAF
     */
    service.getAllocationsFamiliales = function (baseCalcul) {
      return chargesTranchesCalculatorService.calculerTrancheExclusive(baseCalcul, chargesConfig.charges.allocationsFamiliales);
    };

    /**
     * Calcul des cotisations maladie et maternité - CIPAV
     * @FIXME calcul chelou, à vérifier
     */
    service.getAssuranceVieillesseBase = function (baseCalcul) {
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
    service.getMaladiesMaternite = function (baseCalcul) {
      return chargesTranchesCalculatorService.calculerTrancheExclusive(baseCalcul, chargesConfig.charges.maladiesMaternite);
    };

    /**
     * Calcul de l'impot sur les bénéfices - Impots
     */
    service.getImpotSurLesSocietes = function () {
      return chargesTranchesCalculatorService.calculerTranchesCumulatives(service.getBaseCalculIs(), chargesConfig.charges.impotSurLesSocietes);
    };

    return service;

  }

}]);

