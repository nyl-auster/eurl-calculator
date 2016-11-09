/**
 * Configuration 2016 du calculateur
 *
 * SOURCES :
 * https://www.urssaf.fr/portail/home/taux-et-baremes/taux-de-montants/les-professions-liberales/bases-de-calcul-et-taux-des-coti.html#FilAriane
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
    normale:20,
    intermediaire:10,
    reduite:5.5
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

  // paramètres pour le calcul des montants sociales
  parametres.charges.maladiesMaternite = {
    organisme:'urssaf',
    label:'Maladie maternité',
    commentaire:'Pour les revenus compris entre 42 478 € et 54 062 €, taux progressif : entre 2,15 % et 5,25 %',
    type_tranches: 'tranche_exclusive',
    tranches: [
      {
        taux: 6.50,
        plafond: max
      }
    ]
  };

  parametres.charges.allocationsFamiliales = {
    organisme:'urssaf',
    label:'Allocations familiales',
    commentaire:'Pour les revenus compris entre 42 478 € et 54 062 €, taux progressif : entre 2,15 % et 5,25 %',
    type_tranches: 'tranche_exclusive',
    tranches: [
      {
        taux: 0.0215,
        plafond: 42478
      },
      // en fait, le taux est progressif entre 2,15 % et 5,25 %
      // pour les revenus compris entre 42 478 € et 54 062 €. On tire l'estimation vers le haut.
      {
        taux: 0.0525,
        plafond: max
      }
    ]
  };

  // Retraite de base CNAVPL
  // http://service.cipav-retraite.fr/cipav/article-33-recapitulatif-des-options-de-montantmax04.htm
  parametres.charges.assuranceVieillesseBase = {
    label: 'Retraite de base',
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
        montant: 448
      },
      {
        plafond:  'PASS',
        taux: 8.23
      },
      {
        plafond: 193080,
        taux: 1.87
      },
    ]
  };

  parametres.charges.prevoyance = {
    commentaire: "76, 228, ou 380 euros suivant la classe choisie"
  };

  parametres.charges.impotSurLesSocietes = {
    label: 'Impot sur les sociétés',
    type_tranches: 'tranches_cumulatives',
    tranches:[
      {
        plafond: 38120,
        taux: 0.15
      },
      {
        plafond: max,
        taux: 0.3333
      }
    ]
  };

  // Assurance vieillesse complémentaire (obligatoire)
  // http://service.cipav-retraite.fr/cipav/article-33-recapitulatif-des-options-de-montantmax04.htm
  parametres.charges.assuranceVieillesseComplementaire = {
    label : 'Retraite complémentaire',
    type : "tranche_exclusive",
    tranches : [
      {
        nom : 'A',
        plafond : 26420,
        montant : 1198,
        points_retraite : 36
      },
      {
        nom : 'B',
        plafond : 48890,
        montant : 2395,
        points_retraite : 72
      },
      {
        nom : 'C',
        plafond : 57500,
        montant : 3593,
        points_retraite : 108
      },
      {
        nom : 'D',
        plafond : 66000,
        montant : 5989,
        points_retraite : 180
      },
      {
        nom : 'E',
        plafond : 82260,
        montant : 8394,
        points_retraite :  252
      },
      {
        nom : 'F',
        plafond : 102560,
        montant : 13175,
        points_retraite : 396
      },
      {
        nom : 'G',
        plafond : 122560,
        montant : 14373,
        points_retraite : 432
      },
      {
        nom : 'H',
        plafond : max,
        montant : 15570,
        points_retraite : 468
      }
    ]
  };

  parametres.charges.invaliditeDeces = {
    classes:{
      a:{
        nom: 'A',
        montant: 76
      },
      b:{
        nom: 'B',
        montant: 228
      },
      c:{
        nom: 'C',
        montant: 380
      }
    }
  };

  // Réduction assurance vieillesse complémentaire
  parametres.charges.AssuranceVieillesseComplementaireReduction = {
    label: "Réduction assurance vieillesse complémentaire",
    type: "tranche_exclusive",
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

