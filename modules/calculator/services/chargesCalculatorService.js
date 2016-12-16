/**
 * Calculs des charges en fonction des paramètres
 */
 angular.module('calculator').service('chargesCalculatorService',['chargesConfig', function(chargesConfig){

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
   * Retourne le montant pour une tranche de charge.
   *
   * Une tranche est un objet qui peut contenir les clefs suivantes :
   * - montant : peut être déjà rempli pour les montants forfaitaires
   * - taux : le pourcentage à appliquer sur le montant
   * - montant_forfaitaire : si la tranche est un montant fixe en fonction du plafond.
   */
   service.calculerMontantTranche = function(tranche, baseCalcul) {
     var montant = 0;
     baseCalcul = baseCalcul;

    // si un montant forfaitaire est prédéfini pour cette tranche
    if (typeof tranche.montant_forfaitaire !== "undefined") {
      montant = tranche.montant_forfaitaire;
    }
    // sinon on calcule le montant de la tranche en fonction du taux indiqué
    else {
      montant = baseCalcul * (tranche.taux / 100);
    }
    // on ajoute ou met à jour le montant à notre objet tranche
    tranche.montant = montant;
    tranche.baseCalcul = baseCalcul;
    return montant;
  };

  /**
   * Calcul la tranche qui correspond à baseDeCalcul en fonction du tableau "tranches".
   * Pour les tranches exclusives, seule UNE tranche est conservé pour le calcul, les
   * tranches précédentes ou suivantes n'entrent donc en rien dans le calcul du montant
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
     return service.calculerTrancheExclusive(baseCalcul, chargesConfig.charges.assuranceVieillesseComplementaire);
   };

  /**
   * Calcul des cotisations pour la formation professionnelle
   */
   service.formationProfessionnelle = function(baseCalcul) {
     return service.calculerTrancheExclusive(baseCalcul, chargesConfig.charges.formationProfessionnelle);
   };

  /**
   * Calcul des cotisations maladie et maternité - URSSAF
   */
   service.allocationsFamiliales = function(baseCalcul) {
     return service.calculerTrancheExclusive(baseCalcul, chargesConfig.charges.allocationsFamiliales);
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
     var result = service.calculerTranchesCumulatives(baseCalcul, assuranceVieillesseBase);
     return result;
   };

  /**
   * Calcul des cotisations maladie et maternité - URSSAF
   */
   service.maladiesMaternite = function(baseCalcul) {
     return service.calculerTrancheExclusive(baseCalcul, chargesConfig.charges.maladiesMaternite);
   };

  /**
   * Calcul de l'impot sur les bénéfices - Impots
   */
   service.impotSurLesSocietes = function(baseCalcul) {
     return service.calculerTranchesCumulatives(baseCalcul, chargesConfig.charges.impotSurLesSocietes);
   };

   service.tvaNormale = function(baseCalcul) {
     return service.calculerTranchesCumulatives(baseCalcul, chargesConfig.charges.tvaNormale);
   };

   return service;

 }]);

