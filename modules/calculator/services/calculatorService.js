/**
 * Calculs des charges en fonction des paramètres
 *
 * Toutes cotisations contient une clef "tranches"
 * qui est tableau d'objet de la forme suivante :
 * [
 *   {
 *     taux: 2.15,
 *     plafond: 999999,
 *     montant: null,
 *   },
 *   {
 *     plafond: 999999,
 *     montant: 2876
 *   }
 * ]
 */
angular.module('calculator').service('calculatorService',['calculatorConfig', function(calculatorConfig){

  var parametres = calculatorConfig;

  var service = {};

  // formater un resultat pour tous les calculs
  service.result = function() {
    return {
      montant:0,
      tranches:[]
    }
  };

  /**
   * Calcul la tranche qui correspond à baseDeCalcul en fonction du tableau "tranches".
   * Pour les tranches exclusives, seule une tranche est conservé pour le calcul, les
   * tranches précédentes ou suivantes n'entrent en rien dans le calcul du montant
   * de la cotisation
   *
   * @param baseDeCalcul float | int :
   * @param tranches array :
   */
  service.calculerTrancheExclusive = function(baseCalcul, tranches) {

    // on recherche la tranche qui correspond à notre baseCalcul
    var trancheActive = null;
    var result = new service.result();

    tranches.forEach(function(tranche) {
      if (!trancheActive && tranche.plafond != -1 && baseCalcul < tranche.plafond) {
        trancheActive = tranche;
      }
    });

    if (trancheActive) {
      result.montant = trancheActive.montant;
      result.tranches= [trancheActive];
    }

    return result;
  };


  /**
   * Urssaf - maladie et maternité
   * Calculer les cotisations pour maladies et maternié
   */
  service.assuranceVieillesseComplementaire = function(baseCalcul) {
    return service.calculerTrancheExclusive(baseCalcul, parametres.charges.assuranceVieillesseComplementaire.tranches);
  };

  return service;

}]);

