/**
 * Calculs des charges en fonction des paramètres
 *
 * Tout objet charge contient est de la forme suivante :
 * {
 *
 *   // clef pour regrouper les charges par organisme à la présentation
 *   organisme: 'urssaf',
 *
 *   // label à afficher
 *   label: 'Allocations familiales',
 *
 *   // un commentaire à afficher
 *   commentaire: 'Pour les revenus compris entre 42 478 € et 54 062 €, taux progressif : entre 2,15 % et 5,25 %',
 *
 *   // le type de calcul à appliquer sur les tranches
 *   type_tranches: 'tranche_exclusive',
 *
 *   // un tableau tranches est obligatoire, même si une seule tranche semble exister.
 *   tranches: [
 *     {
 *       taux: 2.15,
 *       plafond: -1
 *     },
 *     // en fait, le taux est progressif entre 2,15 % et 5,25 %
 *     // pour les revenus compris entre 42 478 € et 54 062 €. On tire l'estimation vers le haut.
 *     {
 *       taux: 5.25,
 *       plafond: -1
 *     }
 *   ]
 * };
 */
angular.module('calculator').service('calculatorService',['calculatorConfig', function(calculatorConfig){

  var parametres = calculatorConfig;

  var service = {};

  // formater un resultat pour tous les calculs
  service.result = function(charge) {
    return {
      charge: charge,
      montant:0,
      tranches:[]
    }
  };

  /**
   * Calculer le montant d'une tranche. Une tranche est un objet contenant les clefs suivantes :
   * - montant : peut être déjà rempli pour les montants forfaitaires
   * - taux : le taux à appliquer sur la base de calcul pour calculer le montant
   */
  service.calculerMontantTranche = function(tranche, baseCalcul) {
    var montant = null;

    // si un montant forfaitaire est prédéfini pour cette tranche
    if (typeof tranche.montant_forfaitaire !== 'undefined') {
      montant = tranche.montant_forfaitaire;
    }
    // sinon on calcule le montant de la tranche en fonction du taux indiqué
    else {
      montant = (baseCalcul * tranche.taux) / 100;
    }
    // on ajoute ou met à jour le montant à notre objet tranche
    tranche.montant = montant;
    return montant;
  };

  /**
   * Calcul la tranche qui correspond à baseDeCalcul en fonction du tableau "tranches".
   * Pour les tranches exclusives, seule une tranche est conservé pour le calcul, les
   * tranches précédentes ou suivantes n'entrent en rien dans le calcul du montant
   * de la cotisation
   *
   * @param baseCalcul float | int :
   * @param charge array : tableau d'objet "charges"
   */
  service.calculerTrancheExclusive = function(baseCalcul, charge) {

    // on recherche la tranche qui correspond à notre baseCalcul
    var trancheActive = null;
    var result = new service.result(charge);

    charge.tranches.forEach(function(tranche) {
      if (!trancheActive &&  baseCalcul < tranche.plafond) {
        trancheActive = tranche;
      }
    });

    if (trancheActive) {
      result.montant = service.calculerMontantTranche(trancheActive, baseCalcul);
      result.tranches= [trancheActive];
    }

    return result;
  };

  /**
   * Calcul des charges à tranches cumulatives, tels que l'impot sur les bénéfices :
   * - 15% pour pour les 38120 premiers euros, puis 33,33% sur le reste des bénéfices
   *
   * @param baseCalcul float | int :
   * @param charge array : tableau d'objet "charges"
   */
  service.calculerTranchesCumulatives = function(baseCalcul, charge) {

    // contiendra la liste des tranches qui seront appliquée
    // à notre base de calcul
    var tranches = [];

    var result = new service.result(charge);

    // montant total, toute tranches cumulées
    var montant = 0;
    var plancher = 0;

    charge.tranches.forEach(function(tranche, index) {

      // on calcule le "planger" de la tranche, qui est soit égal
      // au plafond précédent, soit à zéro si c'est la première tranche.
      if (typeof tranches[index - 1] !== 'undefined') {
        plancher = tranches[index - 1].plafond;
      }

      // on calcule la différence entre le plafond et le plancher
      tranche.intervalle = tranche.plafond - plancher;

      // si la somme est supérieure ou égale au plafond de la tranche courante ...
      if (baseCalcul >= tranche.plafond)
      {
        // ... on calcule le montant dû pour la tranche courante
        tranche.montant = service.calculerMontantTranche(tranche, tranche.intervalle);
        // on ajoute le montant de la cotisation de cette tranche au total.
        montant += tranche.montant;
        // ajout à la liste des tranches qui s'applique à notre cas.
        tranches.push(tranche);
      }

      // mais si la somme est inférieure au plafond courant, c'est que nous sommes à la dernière tranche
      else
      {
        // on calcule le montant pour cette derniere tranche
        var depassement_plancher = baseCalcul - plancher;
        if (depassement_plancher > 0)
        {
          montant += tranche.montant = service.calculerMontantTranche(tranche, depassement_plancher);
          // ajout à la liste des tranches qui s'appliquent à notre cas.
          tranches.push(tranche);
        }
      }

    });

    result.montant = montant;
    result.tranches= tranches;

    return result;
  };

  /**
   * Calcul des cotisations maladie et maternité - URSSAF
   */
  service.assuranceVieillesseComplementaire = function(baseCalcul) {
    return service.calculerTrancheExclusive(baseCalcul, parametres.charges.assuranceVieillesseComplementaire);
  };

  /**
   * Calcul des cotisations pour la formation professionnelle
   */
  service.formationProfessionnelle = function(baseCalcul) {
    return service.calculerTrancheExclusive(baseCalcul, parametres.charges.formationProfessionnelle);
  };

  /**
   * Calcul des cotisations maladie et maternité - URSSAF
   */
  service.allocationsFamiliales = function(baseCalcul) {
    return service.calculerTrancheExclusive(baseCalcul, parametres.charges.allocationsFamiliales);
  };

  /**
   * Calcul des cotisations maladie et maternité - CIPAV
   * @FIXME calcul chelou, à vérifier
   */
  service.assuranceVieillesseBase = function(baseCalcul) {
    var assuranceVieillesseBase = angular.copy(parametres.charges.assuranceVieillesseBase);
    if (baseCalcul > assuranceVieillesseBase.tranches[0].plafond) {
      delete assuranceVieillesseBase.tranches[0];
    }
    var result = service.calculerTranchesCumulatives(baseCalcul, assuranceVieillesseBase);
    return result;
  };

  /**
   * Calcul des cotisations maladie et maternité - URSSAF
   */
  service.maladiesMaternite = function(baseCalcul) {
    return service.calculerTrancheExclusive(baseCalcul, parametres.charges.maladiesMaternite);
  };

  /**
   * Calcul de l'impot sur les bénéfices - Impots
   */
  service.impotSurLesSocietes = function(baseCalcul) {
    return service.calculerTranchesCumulatives(baseCalcul, parametres.charges.impotSurLesSocietes);
  };

  return service;

}]);

