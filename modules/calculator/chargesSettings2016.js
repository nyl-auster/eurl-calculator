/**
 * Configuration des charges pour l'année 2016
 *
 * SOURCES :
 * https://www.urssaf.fr/portail/home/taux-et-baremes/taux-de-cotisations/les-professions-liberales/bases-de-calcul-et-taux-des-coti.html#FilAriane
 * http://www.rsi.fr/baremes/cotisations.html
 * http://service.cipav-retraite.fr/cipav/rubrique-104-montant-des-cotisations.htm
 * http://service.cipav-retraite.fr/cipav/article-11-votre-protection-sociale-99.htm
 * http://www.cnavpl.fr/les-chiffres-cles/principaux-parametres-du-regime-de-base/principaux-parametres-variables-du-regime-de-base/
 */
angular.module('calculator').provider('parametresCalculCharges2016', function(){

  var parametres = {
    general:{},
    cotisations:{},
    organismes:{}
  };

  // paramètres généraux pour le calcul des cotisations et charges
  parametres.plafond_securite_sociale = 38616;
  parametres.plafond_securite_sociale_precedent = 38040;
  parametres.tva = {
    normale:20,
    intermediaire:10,
    reduite:5.5
  };

  // paramètres pour le calcul des cotisations sociales
  parametres.cotisations.maladiesMaternite = {
    organisme:'urssaf',
    label:'Maladie maternité',
    commentaire:'Pour les revenus compris entre 42 478 € et 54 062 €, taux progressif : entre 2,15 % et 5,25 %',
    type_tranches: 'tranche_exclusive',
    tranches: [
      {
        taux: 6.50,
        plafond: 999999
      }
    ]
  };

  parametres.cotisations.allocationsFamiliales = {
    organisme:'urssaf',
    label:'Allocations familiales',
    type_tranche: 'tranche_exclusive',
    commentaire:'Pour les revenus compris entre 42 478 € et 54 062 €, taux progressif : entre 2,15 % et 5,25 %',
    type_tranches: 'tranche_exclusive',
    tranches: [
      {
        taux: 2.15,
        plafond: 999999
      },
      // en fait, le taux est progressif entre 2,15 % et 5,25 %
      // pour les revenus compris entre 42 478 € et 54 062 €. On tire l'estimation vers le haut.
      {
        taux: 5.25,
        plafond: 999999
      }
    ]
  };

  // Retraite de base CNAVPL
  // http://service.cipav-retraite.fr/cipav/article-33-recapitulatif-des-options-de-cotisation-104.htm
  parametres.cotisations.assuranceVieillesseBase = {
    label: 'Retraite de base',
    description: "Retraite de base CNAVPL",
    revenusNonConnus: 3324 + 6137,
    forfait: {
      plafond: 9171,
      total: 190
    },
    tranches: [
      // sous 4441, cotisation forfaitaire
      {
        plafond:  4441,
        cotisation: 448
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

  parametres.cotisations.prevoyance = {
    commentaire: "76, 228, ou 380 euros suivant la classe choisie"
  };

  parametres.cotisations.impotSurLesSocietes = {
    label: 'Impot sur les sociétés',
    type_tranches: 'tranches_cumulatives',
    tranches:[
      {
        plafond: 38120,
        taux: 15
      },
      {
        plafond: 999999,
        taux: 33.33
      }
    ]
  };

  // Assurance vieillesse complémentaire (obligatoire)
  // http://service.cipav-retraite.fr/cipav/article-33-recapitulatif-des-options-de-cotisation-104.htm
  parametres.cotisations.assuranceVieillesseComplementaire = {
    label : 'Retraite complémentaire',
    type : "tranche_exclusive",
    tranches : [
      {
        nom : 'A',
        plafond : 26420,
        cotisation : 1198,
        points : 36
      },
      {
        nom : 'B',
        plafond : 48890,
        cotisation : 2395,
        points : 72
      },
      {
        nom : 'C',
        plafond : 57500,
        cotisation : 3593,
        points : 108
      },
      {
        nom : 'D',
        plafond : 66000,
        cotisation : 5989,
        points : 180
      },
      {
        nom : 'E',
        plafond : 82260,
        cotisation : 8394,
        points :  252
      },
      {
        nom : 'F',
        plafond : 102560,
        cotisation : 13175,
        points : 396
      },
      {
        nom : 'G',
        plafond : 122560,
        cotisation : 14373,
        points : 432
      },
      {
        nom : 'H',
        plafond : 999999,
        cotisation : 15570,
        points : 468
      }
    ]
  };

  parametres.cotisations.invaliditeDeces = {
    classes:{
      a:{
        nom: 'A',
        cotisation: 76
      },
      b:{
        nom: 'B',
        cotisation: 228
      },
      c:{
        nom: 'C',
        cotisation: 380
      }
    }
  };

  // Réduction assurance vieillesse complémentaire
  parametres.cotisations.AssuranceVieillesseComplementaireReduction = {
    label: "Réduction assurance vieillesse complémentaire",
    type: "tranche_exclusive",
    tranches: [
      {
        plafond : 5632,
        'taux' : 100
      },
      {
        plafond : 11264,
        'taux' : 0.75
      },
      {
        plafond :  16897,
        taux : 0.50
      },
      {
        plafond : 22529,
        'taux' : 0.25
      }
    ]
  };

  // les professions libérales ne cotisent pas pour les indemnités journalières
  // source : http://www.rsi.fr/baremes/cotisations.html
  parametres.cotisations.indemnitesJournalieres = {};

  return parametres;

});

