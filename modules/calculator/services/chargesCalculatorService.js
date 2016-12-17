/**
 * Calculs des charges d'une EULR en fonction des paramètres
 */
angular.module('calculator').service('chargesCalculatorService',['chargesConfig2016', 'chargesTranchesCalculatorService', function(chargesConfig2016, chargesTranchesCalculatorService){

  /**
   * @param params object avec les propriétés suivantes:
   *
   * - chiffreAffaire
   * - remuneration
   * - frais
   * - cfe
   */
  return (params) => {

    service = {};

    chargesConfig = chargesConfig2016;

    service.chiffreAffaireHt = params.chiffreAffaireHt;
    service.remuneration = params.remuneration;
    service.frais = params.frais;
    service.cfe = params.cfe;
    service.tva = params.tva;

    service.getBaseCalculIs = () => {
      return service.chiffreAffaireHt - service.remuneration - service.frais;
    };

    service.getTva = () => {
      return {
        label: 'TVA',
        montant: service.tva
      }
    };

    /**
     * Pseudo charge
     */
    service.getCfe = () => {
      // pseudo calcul : on fait ça juste pour récupérer les meta-données déjà définies
      // dans la configuration des charges (l'objet charge avec son label, son commentaire etc ...)
      const charge = chargesTranchesCalculatorService.calculerTrancheExclusive(0, chargesConfig.charges.cfe);
      // on fixe le montant manuellement.
      charge.montant = service.cfe;
      return charge;
    };

    /**
     * pseudo charge
     * @returns {{label: string, montant: (number|*)}}
     */
    service.getFrais = () => {
      return {
        label: 'Frais',
        montant: service.frais
      };
    };

    service.getBenefice = () => {
      // comme on compte la TVA dans notre total à provisionner, on doit partir
      // du CA TTC pour calculer notre restant une fois retranché
      // la rémunération et le total à provisionner
      return service.chiffreAffaireHt
        - service.getTotalAProvisionner()
        - service.remuneration
        - service.frais;
    };

    service.getCotisationsSocialesArray = () => {
      return [
        service.getAssuranceVieillesseBase(service.remuneration),
        service.getAssuranceVieillesseComplementaire(service.remuneration),
        service.getFormationProfessionnelle(service.remuneration),
        service.getAllocationsFamiliales(service.remuneration),
        service.getMaladiesMaternite(service.remuneration)
      ];
    };

    service.caculerChiffreAffaireTtc = () => service.chiffreAffaireHt + service.tva;

    /**
     * Obtenir le montant total des cotisations sociales
     * @returns {number}
     */
    service.calculerTotalCotisationsSociales = () => {
      var total = 0;
      service.getCotisationsSocialesArray().forEach(item => total += item.montant);
      return total;
    };

    /**
     * Le total a provisionner , c'est à dire ce qui sera payé à l'état
     * à un moement donné.
     * @returns {*}
     */
    service.getTotalAProvisionner = () => {
      let totalCotisationsSociales = service.calculerTotalCotisationsSociales();
      let total = service.cfe + service.tva + totalCotisationsSociales;
      return total;
    };

    /**
     * Calcul des cotisations maladie et maternité - URSSAF
     */
    service.getAssuranceVieillesseComplementaire = (baseCalcul) => {
      return chargesTranchesCalculatorService.calculerTrancheExclusive(baseCalcul, chargesConfig.charges.assuranceVieillesseComplementaire);
    };

    /**
     * Calcul des cotisations pour la formation professionnelle
     */
    service.getFormationProfessionnelle = (baseCalcul) => {
      return chargesTranchesCalculatorService.calculerTrancheExclusive(baseCalcul, chargesConfig.charges.formationProfessionnelle);
    };

    /**
     * Calcul des cotisations maladie et maternité - URSSAF
     */
    service.getAllocationsFamiliales = (baseCalcul) => {
      return chargesTranchesCalculatorService.calculerTrancheExclusive(baseCalcul, chargesConfig.charges.allocationsFamiliales);
    };

    /**
     * Calcul des cotisations maladie et maternité - CIPAV
     * @FIXME calcul chelou, à vérifier
     */
    service.getAssuranceVieillesseBase = (baseCalcul) => {
      let assuranceVieillesseBase = angular.copy(chargesConfig.charges.assuranceVieillesseBase);
      if (baseCalcul > assuranceVieillesseBase.tranches[0].plafond) {
        delete assuranceVieillesseBase.tranches[0];
      }
      let result = chargesTranchesCalculatorService.calculerTranchesCumulatives(baseCalcul, assuranceVieillesseBase);
      return result;
    };

    /**
     * Calcul des cotisations maladie et maternité - URSSAF
     */
    service.getMaladiesMaternite = (baseCalcul) => {
      return chargesTranchesCalculatorService.calculerTrancheExclusive(baseCalcul, chargesConfig.charges.maladiesMaternite);
    };

    /**
     * Calcul de l'impot sur les bénéfices - Impots
     */
    service.getImpotSurLesSocietes = () => {
      return chargesTranchesCalculatorService.calculerTranchesCumulatives(service.getBaseCalculIs(), chargesConfig.charges.impotSurLesSocietes);
    };

    return service;

  }

}]);

