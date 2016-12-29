/**
 * Calculs des charges d'une EURL en fonction des paramètres
 *
 * Les méthodes de ce services enrichit les objets de type charges
 * tels que définit dans le fichier de configuration des charges, avec commes clefs obligatoires.
 * La clef "tranchesActives" indique les tranches qui sont appliquées à notre base de calcul
 *
 * return {
 *   label:"nom de la charge"
 *   montant:7,
 *   tranchesActives: [
 *     {
 *       label: "Tranche 1",
 *       montant: 8,
 *     }
 *   ]
 * }
 */
angular.module('calculator').service('chargesCalculatorService',['chargesConfig2016', 'chargesTranchesCalculatorService', function(chargesConfig2016, chargesTranchesCalculatorService){

  /**
   * @param params object avec les propriétés suivantes:
   *
   * - chiffreAffaireHt
   * - chiffreAffaireTtc
   * - remuneration
   * - fraisTtc
   * - cfe
   * - tva à reverser
   * - prevoyance
   */
  return (params) => {

    const self = {};

    const chargesConfig = chargesConfig2016;

    self.chiffreAffaireTtc = params.chiffreAffaireTtc;
    self.chiffreAffaireHt = params.chiffreAffaireHt;
    self.remuneration = params.remuneration;
    self.fraisTtc = params.fraisTtc;
    self.fraisHt = params.fraisHt;
    self.cfe = params.cfe;
    self.prevoyance = params.prevoyance;

    /**
     * @FIXME à réecrire clean
     * @returns {*}
     */
    self.getPrevoyance = () => {

      let classeChoisie = null;
      chargesConfig2016.charges.prevoyance.classes.forEach((classe) => {
        if (classe.classe == self.prevoyance) {
          classeChoisie = classe;
        }
      });

      let charge = chargesConfig2016.charges.prevoyance;
      if (classeChoisie) {
        charge.label = "Prévoyance classe " + classeChoisie.classe;
        charge.montant = classeChoisie.montant_forfaitaire;
      }
      else {
        charge.montant = chargesConfig2016.charges.prevoyance.classes[0].montant_forfaitaire;
      }

      return charge;
    };

    /**
     * La tva collectée pour le compte de l'état, c'est à dire la tva des ventes
     * @returns {number}
     */
    self.getTvaCollectee = () => {
      return {
        montant: self.chiffreAffaireTtc - self.chiffreAffaireHt
      };
    };

    /**
     * La tva sur les achats, à déduire de la TVA "collectée" (celle des ventes)
     * @returns {number}
     */
    self.getTvaDeductible = () => {
      return {
        montant:self.fraisTtc - self.fraisHt
      }
    };

    /**
     * Otenir la base de calcul pour l'impot sur les sociétés.
     * La base de calcul est le résultat fiscal (résultat comptable + charges non déductibles)
     * Le résultat comptable, ce sont les produits moins les charges
     * @returns {number}
     */
    self.getBaseCalculIs = () => {
      return self.chiffreAffaireHt
        - self.remuneration
        - self.fraisHt
        - self.getTotalCotisationsSociales().montant
        - self.getCfe().montant
        - self.getCgsCrds().montant
        - self.getPrevoyance().montant;
    };

    self.getTva = () => {
      return {
        label: 'TVA à reverser',
        organisme: 'Impots',
        montant: self.getTvaCollectee().montant - self.getTvaDeductible().montant
      }
    };

    /**
     * Pseudo charge
     */
    self.getCfe = () => {
      return {
        label: "CFE",
        commentaire: "Cotisation foncière des entreprises",
        montant: self.cfe
      };
    };

    /**
     * pseudo charge
     * @returns {{label: string, montant: (number|*)}}
     */
    self.getfraisTtc = () => {
      return {
        label: 'fraisTtc',
        montant: self.fraisTtc
      };
    };

    /**
     * Ce qu'il nous reste en banque à partir de notre TTC après avoir
     * - payé tout ce que l'on devait
     * - payé notre rémunération
     * - payé nos frais TTC
     * @returns {{label: string, montant: number}}
     */
    self.getResteEnBanque = () => {
      const montant = self.chiffreAffaireTtc
        - self.fraisTtc
        - self.remuneration
        - self.getTotalAProvisionner().montant;
      return {
        label: "Reste en Banque",
        montant: montant
      };
    };

    /**
     * Toute les cotisations sociales à l'exception de la CGS-CRDS et de la prévoyance
     * @returns {[*,*,*,*,*]}
     */
    self.getCotisationsSocialesArray = () => {
      return [
        self.getAssuranceVieillesseBase(self.remuneration),
        self.getAssuranceVieillesseComplementaire(self.remuneration),
        self.getMaladiesMaternite(self.remuneration),
        self.getFormationProfessionnelle(self.remuneration),
        self.getAllocationsFamiliales(self.remuneration)
      ];
    };

    /**
     * Obtenir le montant total des cotisations sociales
     * @returns {number}
     */
    self.calculerTotalCotisationsSociales = () => {
      let total = 0;
      self.getCotisationsSocialesArray().forEach(item => total += item.montant);
      return total;
    };

    /**
     * Le total a provisionner, ce pour quoi j'ai créer l'application
     * c'est à dire ce qui devra être payé un jour ou l'autre, peu
     * nous importe la date d'ailleurs peu prédictible.
     * à un moement donné.
     * @returns {*}
     */
    self.getTotalAProvisionner = () => {
      let total = self.getCfe().montant
        + self.getTva().montant
        + self.getTotalCotisationsSociales().montant
        + self.getCgsCrds().montant
        + self.getPrevoyance().montant
        + self.getImpotSurLesSocietes().montant;
      return {
        id:'totalAProvisionner',
        label:'Total à provisionner',
        montant:total
      };
    };

    self.getTotalCotisationsSociales = () => {
      return {
        label: 'Cotisations sociales',
        montant: self.calculerTotalCotisationsSociales()
      }
    };

    /**
     * Calcul des cotisations maladie et maternité - URSSAF
     */
    self.getAssuranceVieillesseComplementaire = (baseCalcul) => {
      return chargesTranchesCalculatorService.calculerTrancheExclusive(baseCalcul, chargesConfig.charges.assuranceVieillesseComplementaire);
    };

    /**
     * Calcul des cotisations pour la formation professionnelle
     */
    self.getFormationProfessionnelle = () => {
      const baseCalcul = chargesConfig.plafond_securite_sociale;
      return chargesTranchesCalculatorService.calculerTrancheExclusive(baseCalcul, chargesConfig.charges.formationProfessionnelle);
    };

    /**
     * Calcul des cotisations maladie et maternité - URSSAF
     * https://www.urssaf.fr/portail/home/independant/je-beneficie-dexonerations/modulation-de-la-cotisation-dall.html
     */
    self.getAllocationsFamiliales = (baseCalcul) => {
      const config = chargesConfig.charges.allocationsFamiliales;
      // le taux de la tranche 2 est progressif
      const tauxReduit = config.tranches[1].taux_reduit;
      const tauxPlein = config.tranches[1].taux_plein;
      const PASS = chargesConfig2016.plafond_securite_sociale;
      const tauxProgressif = ((tauxPlein - tauxReduit) / (0.3 * PASS)) * (baseCalcul - 1.1 * PASS) + tauxReduit;
      // voilà notre taux à appliquer pour les base de calcul comprises entre 110% et 140% du passe
      config.tranches[1]['taux'] = tauxProgressif;
      return chargesTranchesCalculatorService.calculerTrancheExclusive(baseCalcul, config);
    };

    /**
     * Calcul des cotisations maladie et maternité - CIPAV
     * @FIXME calcul chelou, à vérifier
     */
    self.getAssuranceVieillesseBase = (baseCalcul) => {
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
    self.getMaladiesMaternite = (baseCalcul) => {
      return chargesTranchesCalculatorService.calculerTrancheExclusive(baseCalcul, chargesConfig.charges.maladiesMaternite);
    };

    /**
     * Calcul de l'impot sur les bénéfices - Impots
     */
    self.getImpotSurLesSocietes = () => {
      return chargesTranchesCalculatorService.calculerTranchesCumulatives(self.getBaseCalculIs(), chargesConfig.charges.impotSurLesSocietes);
    };

    /**
     * la CGS-CRDS se calcul sur la rému augmenté des autre cotisatiions sociales hors CSG-CRDS
     */
    self.getCgsCrds= () => {
      const baseCalcul = self.remuneration + self.getTotalCotisationsSociales().montant;
      return chargesTranchesCalculatorService.calculerTranchesCumulatives(baseCalcul, chargesConfig.charges.cgsCrds);
    };

    return self;

  }

}]);

