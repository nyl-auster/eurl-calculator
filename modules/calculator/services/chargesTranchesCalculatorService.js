/**
 * Augment les objets charges avec deux clefs :
 * - le montant global à payer en fonction de la base de calcul
 * - les "tranches actives" : le détail du montant par tranche
 */
angular.module('calculator').service('chargesTranchesCalculatorService',['chargesConfig2016', function(chargesConfig2016){

  const service = {};

  /**
   * Retourne le montant pour une tranche de charge.
   *
   * Une tranche est un objet qui peut contenir les clefs suivantes :
   * - montant : peut être déjà rempli pour les montants forfaitaires
   * - taux : le pourcentage à appliquer sur le montant
   * - montant_forfaitaire : si la tranche est un montant fixe en fonction du plafond.
   */
  service.calculerMontantTranche = (tranche, baseCalcul) => {

    var montant = 0;

    // si un montant forfaitaire est prédéfini pour cette tranche
    if (tranche.montant_forfaitaire) {
      montant = tranche.montant_forfaitaire;
    }
    // sinon on calcule le montant de la tranche en fonction du taux indiqué
    else if (tranche.taux) {
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
   * @param charge array : tableau d'objet "charge"
   */
  service.calculerTrancheExclusive = (baseCalcul, charge) => {

    charge.montant = 0;

    // on recherche la tranche qui correspond à notre baseCalcul
    var trancheActive = null;

    charge.tranches.forEach(function(tranche) {
      // tant que la base de calcul n'est pas supérieur au plafond en cours, on continue
      // d'itérer.
      if (!trancheActive && baseCalcul <= tranche.plafond) {
        // on a dépassé le plafond, on arrête de mettre à jour la variable trancheActive
        // qui contient maintenant notre réponse
        trancheActive = tranche;
      }
    });

    if (trancheActive) {
      charge.montant = service.calculerMontantTranche(trancheActive, baseCalcul);
      charge.tranchesActives= [trancheActive];
    }

    return charge;
  };

  /**
   * Calcul des charges à tranches cumulatives, tels que l'impot sur les bénéfices :
   * - 15% pour pour les 38120 premiers euros, puis 33,33% sur le reste des bénéfices
   *
   * @param baseCalcul float | int :
   * @param charge array : tableau d'objet "charges"
   */
  service.calculerTranchesCumulatives = (baseCalcul, charge) => {

    charge.montant = 0;

    // contiendra la liste des tranches qui seront appliquée
    // à notre base de calcul
    var tranches = [];

    // montant total, toute tranches cumulées
    var montant = 0;
    var plancher = 0;

    charge.tranches.forEach((tranche, index) => {

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
        let depassement_plancher = baseCalcul - plancher;
        if (depassement_plancher > 0)
        {
          montant += tranche.montant = service.calculerMontantTranche(tranche, depassement_plancher);
          // ajout à la liste des tranches qui s'appliquent à notre cas.
          tranches.push(tranche);
        }
      }

    });

    charge.montant = montant;
    charge.tranchesActives= tranches;

    return charge;
  };

  return service;

}]);

