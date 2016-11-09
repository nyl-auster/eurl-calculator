/**
 * Configuration 2016 du calculateur
 *
 * SOURCES :
 * https://www.urssaf.fr/portail/home/taux-et-baremes/taux-de-cotisations/les-professions-liberales/bases-de-calcul-et-taux-des-coti.html
 * http://www.rsi.fr/baremes/charges.html
 * http://service.cipav-retraite.fr/cipav/rubriquemax04-montant-des-charges.htm
 * http://service.cipav-retraite.fr/cipav/articlemax1-votre-protection-sociale-99.htm
 * http://www.cnavpl.fr/les-chiffres-cles/principaux-parametres-du-regime-de-base/principaux-parametres-variables-du-regime-de-base/
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

  // données concernant les organismes
  parametres.organismes = {
    urssaf: {
      label: "URSSAF"
    },
    rsi: {
      label: 'RSI'
    },
    cipav: {
      label: 'CIPAV'
    }
  };

  // URSSAF : MALADIE-MATERNITE
  parametres.charges.maladiesMaternite = {
    organisme:'urssaf',
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
    organisme:'urssaf',
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
    organisme:'urssaf',
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
    organisme: 'urssaf',
    label: 'Formation professionnelle',
    commentaire: "Base de calcul : Sur la base de 38 616 . Cotisation à verser en 2016. Si votre conjoint a opté pour le statut de conjoint collaborateur, le taux est de 0,34 %",
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
  parametres.charges.assuranceVieillesseBase = {
    label: 'Retraite de base',
    type_tranches: 'exclusive',
    description: "Retraite de base CNAVPL",
    revenusNonConnus: 3324 + 6137,
    forfait: {
      plafond: 9171,
      total: 190
    },
    tranches: [
      // sous 4441, montant forfaitaire
      {
        plafond:  4441,
        montant_forfaitaire: 448
      },
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

  parametres.charges.prevoyance = {
    commentaire: "76, 228, ou 380 euros suivant la classe choisie"
  };

  parametres.charges.impotSurLesSocietes = {
    label: 'Impot sur les sociétés',
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

  // Assurance vieillesse complémentaire (obligatoire)
  // http://service.cipav-retraite.fr/cipav/article-33-recapitulatif-des-options-de-montantmax04.htm
  parametres.charges.assuranceVieillesseComplementaire = {
    label : 'Retraite complémentaire',
    type : "exclusive",
    tranches : [
      {
        nom : 'A',
        plafond : 26420,
        montant_forfaitaire : 1198,
        points_retraite : 36
      },
      {
        nom : 'B',
        plafond : 48890,
        montant_forfaitaire : 2395,
        points_retraite : 72
      },
      {
        nom : 'C',
        plafond : 57500,
        montant_forfaitaire : 3593,
        points_retraite : 108
      },
      {
        nom : 'D',
        plafond : 66000,
        montant_forfaitaire : 5989,
        points_retraite : 180
      },
      {
        nom : 'E',
        plafond : 82260,
        montant_forfaitaire : 8394,
        points_retraite :  252
      },
      {
        nom : 'F',
        plafond : 102560,
        montant_forfaitaire : 13175,
        points_retraite : 396
      },
      {
        nom : 'G',
        plafond : 122560,
        montant_forfaitaire : 14373,
        points_retraite : 432
      },
      {
        nom : 'H',
        plafond : max,
        montant_forfaitaire : 15570,
        points_retraite : 468
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

  // Réduction assurance vieillesse complémentaire
  parametres.charges.AssuranceVieillesseComplementaireReduction = {
    label: "Réduction assurance vieillesse complémentaire",
    type: "exclusive",
    tranches: [
      {
        plafond : 5632,
        taux : 100
      },
      {
        plafond : 11264,
        taux : 0.75
      },
      {
        plafond :  16897,
        taux : 0.50
      },
      {
        plafond : 22529,
        taux : 0.25
      }
    ]
  };

  // les professions libérales ne cotisent pas pour les indemnités journalières
  // source : http://www.rsi.fr/baremes/charges.html
  parametres.charges.indemnitesJournalieres = {};

  return parametres;

});

