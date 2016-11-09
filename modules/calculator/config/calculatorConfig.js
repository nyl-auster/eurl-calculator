/**
 * Configuration 2016 du calculateur
 *
 * SOURCES :
 * https://www.urssaf.fr/portail/home/taux-et-baremes/taux-de-cotisations/les-professions-liberales/bases-de-calcul-et-taux-des-coti.html
 * http://www.rsi.fr/baremes/charges.html
 * http://service.cipav-retraite.fr/cipav/rubriquemax04-montant-des-charges.htm
 * http://service.cipav-retraite.fr/cipav/articlemax1-votre-protection-sociale-99.htm
 * http://www.cnavpl.fr/les-chiffres-cles/principaux-parametres-du-regime-de-base/principaux-parametres-variables-du-regime-de-base/
 *
 * https://www.rsi.fr/cotisations/professions-liberales/presentation-des-cotisations.html
 * Le RSI gère uniquement votre protection santé maladie-maternité.
 * la retraite et l'invalidité décès sont assurées par la CNAVPL ou la CNBF
 * les cotisations d'allocations familiales, les contributions sociales (CSG/CRDS) et les contributions à la formation professionnelle sont à verser à l'Urssaf
 */
angular.module('calculator').service('calculatorConfig', function(){

  const max = 999999999999999999999;

  var parametres = {
    general:{},
    charges:{},
    organismes:{}
  };

  parametres.plafondMax = max;

  // paramètres généraux pour le calcul des montants et charges
  parametres.plafond_securite_sociale = 38616;
  parametres.plafond_securite_sociale_precedent = 38040;
  parametres.tva = {
    normale: 20,
    intermediaire: 10,
    reduite: 5.5
  };

  // URSSAF : MALADIE-MATERNITE
  parametres.charges.maladiesMaternite = {
    organisme:'URSSAF',
    label:'Maladie-maternité',
    commentaire:'Base de calcul : totalité des revenus professionnels',
    type_tranches: 'tranche_exclusive',
    tranches: [
      {
        taux: 6.50,
        plafond: max
      }
    ]
  };

  // URSSAF : ALLOCATIONS FAMILIALES
  parametres.charges.allocationsFamiliales = {
    organisme:'URSSAF',
    label:'Allocations familiales',
    commentaire:"Pour les revenus compris entre 42 478 € et 54 062 €, taux progressif : entre 2,15 % et 5,25 %. Faute de détails, le calculateur passe à 5.25 dès qu'on dépasse 42 478 €",
    type_tranches: 'tranche_exclusive',
    tranches: [
      {
        taux: 2.15,
        plafond: 42478
      },
      // en fait, le taux est progressif entre 2,15 % et 5,25 %
      // pour les revenus compris entre 42 478 € et 54 062 €. On tire l'estimation vers le haut.
      {
        taux: 5.25,
        plafond: max
      }
    ]
  };

  // URSSAF : CGS-CRDS
  parametres.charges.cgsCrds = {
    organisme:'URSSAF',
    label:'CGS-CRDS',
    commentaire:"Base de calcul : 	Totalité du revenu de l’activité non salariée + cotisations sociales obligatoires",
    type_tranches: 'exclusive',
    tranches: [
      {
        taux: 8,
        plafond: max
      }
    ]
  };

  // URSSAF : FORMATION PROFESSIONNELLE
  parametres.charges.formationProfessionnelle = {
    organisme: 'URSSAF',
    label: 'Formation professionnelle',
    commentaire: "Base de calcul : Sur la base de " + parametres.plafond_securite_sociale + " €  . Cotisation à verser en 2016. Si votre conjoint a opté pour le statut de conjoint collaborateur, le taux est de 0,34 %",
    type_tranches: 'exclusive',
    tranches: [
      {
        taux: 0.25,
        plafond: max
      }
    ]
  };

  // CIPAV - Retraite de base CNAVPL
  // http://service.cipav-retraite.fr/cipav/article-33-recapitulatif-des-options-de-montantmax04.htm
  // Voir le simulateur ici pour des exemples concrets : http://www.guide-tns.fr/simulateurs/chargesprofessionnelliberal.html
  parametres.charges.assuranceVieillesseBase = {
    label: 'Retraite de base',
    organisme: 'CIPAV',
    type_tranches: 'batarde',
    description: "Retraite de base CNAVPL",
    commentaire: "En cas de revenus non connus : 3 178 € (maximum de la tranche 1) ; 3 611 € (maximum de la tranche 2)",
    tranches: [
      // sous 4441, montant forfaitaire
      {
        plafond:  4441,
        montant_forfaitaire: 448
      },
      // d'abord on devra calcul le pourcentage sur cette tranche dans la limite du plafond,
      // puis on y ajoutera la seconde tranche en reprenant la base de calcul en entier.
      // WTF ?
      {
        plafond: parametres.plafond_securite_sociale,
        taux: 8.23
      },
      {
        plafond: 193080,
        taux: 1.87
      }
    ]
  };

  // IMPOT
  parametres.charges.impotSurLesSocietes = {
    label: 'Impot sur les sociétés',
    organisme: "Impots",
    type_tranches: 'cumulatives',
    tranches:[
      {
        plafond: 38120,
        taux: 15
      },
      {
        plafond: max,
        taux: 33.33
      }
    ]
  };

  // CIPAV: Assurance vieillesse complémentaire (obligatoire)
  // http://service.cipav-retraite.fr/cipav/article-33-recapitulatif-des-options-de-montantmax04.htm
  parametres.charges.assuranceVieillesseComplementaire = {
    label : 'Retraite complémentaire',
    organisme: 'CIPAV',
    type : "exclusive",
    tranches : [
      {
        nom : 'A',
        plafond : 26580,
        montant_forfaitaire : 1214,
        points_retraite : 36
      },
      {
        nom : 'B',
        plafond : 49280,
        montant_forfaitaire : 2427,
        points_retraite : 72
      },
      {
        nom : 'C',
        plafond : 57850,
        montant_forfaitaire : 3641,
        points_retraite : 108
      },
      {
        nom : 'D',
        plafond : 66400,
        montant_forfaitaire : 6068,
        points_retraite : 180
      },
      {
        nom : 'E',
        plafond : 83060,
        montant_forfaitaire : 8495,
        points_retraite :  252
      },
      {
        nom : 'F',
        plafond : 103180,
        montant_forfaitaire : 13349,
        points_retraite : 396
      },
      {
        nom : 'G',
        plafond : 123300,
        montant_forfaitaire : 14563,
        points_retraite : 432
      },
      {
        nom : 'H',
        plafond : max,
        montant_forfaitaire : 15776,
        points_retraite : 468
      }
    ]
  };

  // Réduction assurance vieillesse complémentaire
  parametres.charges.AssuranceVieillesseComplementaireReduction = {
    label: "Réduction assurance vieillesse complémentaire",
    type: "exclusive",
    tranches: [
      {
        plafond : 5792,
        taux : 100,
        points_retraite:0
      },
      {
        plafond : 11585,
        taux : 75,
        points_retraite:9
      },
      {
        plafond :  17377,
        taux :50,
        points_retraite:18
      },
      {
        plafond : 23170,
        taux : 25,
        points_retraite:27
      }
    ]
  };

  parametres.charges.invaliditeDeces = {
    classes:{
      a:{
        nom: 'A',
        montant_forfaitaire: 76
      },
      b:{
        nom: 'B',
        montant_forfaitaire: 228
      },
      c:{
        nom: 'C',
        montant_forfaitaire: 380
      }
    }
  };

  // les professions libérales ne cotisent pas pour les indemnités journalières
  // source : http://www.rsi.fr/baremes/charges.html
  parametres.charges.indemnitesJournalieres = {};

  return parametres;

});

