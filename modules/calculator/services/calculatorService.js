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
    // on a pas de montant déjà défini mais on a un taux qui permet le calcul
    if (typeof tranche.montant == 'undefined' && tranche.taux) {
      montant = baseCalcul * tranche.taux;
    }
    // sinon on garde juste le montant de la tranche
    else {
      montant = tranche.montant;
    }
    console.log(montant);
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

    // on recherche la tranche qui correspond à notre baseCalcul
    var tranches = [];
    var result = new service.result(charge);
    var montant = 0;
    var plancher = 0;

    charge.tranches.forEach(function(tranche, index) {

      if (typeof tranches[index - 1] !== 'undefined') {
        plancher = tranches[index - 1].plafond;
      }

      tranche.intervalle = tranche.plafond - plancher;

      // si la somme est supérieure au plafond de la tranche courante ...
      if (baseCalcul >= tranche.plafond)
      {
        // ... on calcule le montant dû pour la tranche courante
        tranche.montant = service.calculerMontantTranche(tranche, tranche.intervalle);
        tranche.baseCalcul = tranche.intervalle;
        // on ajoute le montant de la cotisation de cette tranche au total.
        montant += tranche.montant;
        tranches.push(tranche);
      }

      // mais si la somme est inférieure au plafond courant, c'est que nous sommes à la dernière tranche qui nous intéresse pour le calcul
      else
      {
        // on calcule le montant pour cette derniere tranche
        var depassement_plancher = baseCalcul - plancher;
        if (depassement_plancher > 0)
        {
          tranche.baseCalcul = depassement_plancher;
          montant += tranche.montant = service.calculerMontantTranche(tranche, depassement_plancher);
          tranches.push(tranche);
        }
        // si le depassement du plancher est négatif, c'est qu'on est passé dans les tranches supérieurs
        // à la derniere "imposable". On indique tout de même une cotisation de zéro pour information.
        else
        {
          tranche.montant = 0;
          tranche.baseCalcul = 0;
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
   * Calcul des cotisations maladie et maternité - URSSAF
   */
  service.allocationsFamiliales = function(baseCalcul) {
    return service.calculerTrancheExclusive(baseCalcul, parametres.charges.allocationsFamiliales);
  };

  /**
   * Calcul de l'impot sur les bénéfices - Impots
   */
  service.impotSurLesSocietes = function(baseCalcul) {
    console.log("====");
    return service.calculerTranchesCumulatives(baseCalcul, parametres.charges.impotSurLesSocietes);
  };

  return service;

}]);

