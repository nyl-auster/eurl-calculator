/**
 * Les objets "charges" d'une EURL à l'IS en PL
 * qui seront consommés par le service "chargesCalculator",
 * qui permettra de calculer le montant des cotisations et impots à payer.
 *
 * Une "charge" *DOIT* contenir les propriétés suivantes :
 *
 * // l'organisme qui doit recueillir la charge
 * organisme: 'urssaf',
 *
 * // label de la charge à afficher dans le tableau de résultats
 * label: 'Allocations familiales',
 *
 * // remarque supplémentaire concernant le calcul de la charge
 * commentaire: 'Pour les revenus compris entre 42 478 € et 54 062 €, taux progressif : entre 2,15 % et 5,25 %',
 *
 * // Chaque charge contient une à plusieurs tranches. Le type de tranche
 * // indique comment une tranche doit être calculée : en cumulant les cotisations
 * // pour chaque tranche existante, on sélectionnant uniquement une des tranches etc...
 * // il existe les types suivants :
 * // - tranche_exclusive : une seule tranche sera choisie pour effectuer le calcul
 * // - tranches_cumulatives : le montant de chaque tranque se cumule pour créer un total
 * type_tranches: 'tranche_exclusive',
 *
 * // un tableau des tranches est obligatoire, même si une seule tranche existe.
 * tranches: [
 *   {
 *     taux: 0.0215, // le taux à appliquer. "0.0215" définit un pourcentage de 2,15%
 *     plafond: 32000 // le plafond au delà duquel on passe à la tranche suivante
 *   }
 * ]
 *
 * SOURCES pour le calcul des cotisations:
 *
 *   CIPAV
 *   http://www.cnavpl.fr/les-chiffres-cles/principaux-parametres-du-regime-de-base/principaux-parametres-variables-du-regime-de-base/
 *
 *   URSSAF
 *   https://www.urssaf.fr/portail/home/taux-et-baremes/taux-de-cotisations/les-professions-liberales/bases-de-calcul-et-taux-des-coti.html
 *   https://www.urssaf.fr/portail/home/independant/mes-cotisations/quelles-cotisations/les-contributions-csg-crds/taux-de-la-csg-crds.html
 *
 *   RSI
 *   https://www.rsi.fr/cotisations/professions-liberales/presentation-des-cotisations.html
 *   http://www.leblogdudirigeant.com/tns-base-de-calcul-cotisations-25022015albddlau/
 *
 * Le RSI gère votre protection santé maladie-maternité.
 *
 * La retraite et l'invalidité décès sont assurées par la CNAVPL ou la CNBF
 *
 * Les autres cotisations sociales sont à verser à l'URSSAF :
 * allocations familiales, les contributions sociales (CSG/CRDS),
 * formation professionnelle
 */
angular.module('calculator').service('chargesConfig2016', function(){

  const parametres = {
    general:{},
    charges:{},
    organismes:{}
  };

  parametres.plafondMax =  Number.MAX_SAFE_INTEGER;

  // paramètres généraux pour le calcul des montants et charges
  parametres.plafond_securite_sociale = 38616;

  // URSSAF : MALADIE-MATERNITE
  parametres.charges.maladiesMaternite = {
    organisme:'RSI',
    type_tranches: 'tranche_exclusive',
    label:'Maladie-maternité',
    commentaire:'Base de calcul : totalité des revenus professionnels',
    type_tranches: 'tranche_exclusive',
    tranches: [
      {
        label: "Tranche 1",
        taux: 6.50,
        plafond: parametres.plafondMax
      }
    ]
  };

  // URSSAF : ALLOCATIONS FAMILIALES
  parametres.charges.allocationsFamiliales = {
    organisme:'URSSAF',
    label:'Allocations familiales',
    commentaire:"Pour les revenus compris entre 42 478 € et 54 062 €, taux progressif : entre 2,15 % et 5,25 %. Faute de détails, le calculateur passe à 5.25 dès qu'on dépasse 42 478 €",
    type_tranches: 'exclusive',
    tranches: [
      {
        label: "Tranche 1",
        plafond:42478,
        commentaire:"Le plafond de cette tranche est égal à 110% du PASS",
        taux:2.15
      },
      // la clef taux de cette tranche sera calculée dynamiquement
      {
        label:'Tranche 2',
        commentaire:"Taux progressif de 2.15% à 5.25% entre 110% du PASS et 140% du PASS",
        taux_reduit:2.15,
        taux_plein:5.25,
        plafond: 54062
      },
      {
        label:'Tranche 3',
        taux: 5.25,
        plafond: parametres.plafondMax
      }
    ]
  };

  // URSSAF : CGS-CRDS
  parametres.charges.cgsCrds = {
    organisme:'URSSAF',
    label:'CGS-CRDS',
    commentaire:"Base de calcul : 	Totalité du revenu de l’activité non salariée + cotisations sociales obligatoires hors CSG-CRDS",
    type_tranches: 'exclusive',
    tranches: [
      {
        label:"Tranche 1",
        taux: 8,
        plafond: parametres.plafondMax
      }
    ]
  };

  // URSSAF : CSG-CRDS (la distinction déductible n'est pas faite)
  parametres.charges.csgNonDeductible = {
    organisme:'URSSAF',
    label:'CSG-CRDS Non déductible',
    commentaire:"Base de calcul : 	Totalité du revenu de l’activité non salariée + cotisations sociales obligatoires hors CSG-CRDS",
    type_tranches: 'exclusive',
    tranches: [
      {
        label:"Tranche 1",
        taux: 2.9,
        plafond: parametres.plafondMax
      }
    ]
  };

  // URSSAF : FORMATION PROFESSIONNELLE
  parametres.charges.formationProfessionnelle = {
    organisme: 'URSSAF',
    label: 'Formation professionnelle',
    commentaire: "Base de calcul forfaitaire (fixe): plafond de la sécurité sociale",
    type_tranches: 'exclusive',
    tranches: [
      {
        label: "Tranche 1",
        taux: 0.25,
        plafond: parametres.plafondMax
      }
    ]
  };

  // CIPAV - Retraite de base CNAVPL
  // http://service.cipav-retraite.fr/cipav/article-33-recapitulatif-des-options-de-montantmax04.htm
  // Voir le simulateur ici pour des exemples concrets : http://www.guide-tns.fr/simulateurs/chargesprofessionnelliberal.html
  parametres.charges.assuranceVieillesseBase = {
    label: 'Retraite de base',
    organisme: 'CIPAV',
    type_tranches: 'custom',
    description: "Retraite de base CNAVPL",
    commentaire: "En cas de revenus non connus : 3 178 € (maximum de la tranche 1) ; 3 611 € (maximum de la tranche 2)",
    tranches: [
      {
        label:"Tranche 1",
        commentaire:"Sous 4441, le montant est forfaitaire",
        plafond:  4441,
        montant_forfaitaire: 448
      },
      // d'abord on devra calcul le pourcentage sur cette tranche dans la limite du plafond,
      // puis on y ajoutera la seconde tranche en reprenant la base de calcul en entier.
      // WTF ?
      {
        label:"Tranche 2",
        plafond: parametres.plafond_securite_sociale,
        taux: 8.23
      },
      {
        label: "Tranche 3",
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
        label: "tranche 1",
        plafond: 38120,
        taux: 15
      },
      {
        label: "tranche 2",
        plafond: parametres.plafondMax,
        taux: 33
      }
    ]
  };

  // CIPAV: Assurance vieillesse "complémentaire" ( mais obligatoire :-p )
  // http://service.cipav-retraite.fr/cipav/article-28-principes-de-calcul-des-cotisations-103.htm
  // http://service.cipav-retraite.fr/cipav/article-33-recapitulatif-des-options-de-montantmax04.htm
  parametres.charges.assuranceVieillesseComplementaire = {
    label : 'Retraite complémentaire',
    organisme: 'CIPAV',
    type_tranches : "exclusive",
    tranches : [
      {
        label : 'A',
        plafond : 26580,
        montant_forfaitaire : 1214,
        points_retraite : 36
      },
      {
        label : 'B',
        plafond : 49280,
        montant_forfaitaire : 2427,
        points_retraite : 72
      },
      {
        label : 'C',
        plafond : 57850,
        montant_forfaitaire : 3641,
        points_retraite : 108
      },
      {
        label : 'D',
        plafond : 66400,
        montant_forfaitaire : 6068,
        points_retraite : 180
      },
      {
        label : 'E',
        plafond : 83060,
        montant_forfaitaire : 8495,
        points_retraite :  252
      },
      {
        label : 'F',
        plafond : 103180,
        montant_forfaitaire : 13349,
        points_retraite : 396
      },
      {
        label : 'G',
        plafond : 123300,
        montant_forfaitaire : 14563,
        points_retraite : 432
      },
      {
        label : 'H',
        plafond : parametres.plafondMax,
        montant_forfaitaire : 15776,
        points_retraite : 468
      }
    ]
  };

  // Réduction assurance vieillesse complémentaire
  // @pas appliquée dans le calculateur pour le moment
  parametres.charges.AssuranceVieillesseComplementaireReduction = {
    organisme:'CIPAV',
    label: "Réduction assurance vieillesse complémentaire",
    type_tranches: "exclusive",
    tranches: [
      {
        label: "Tranche 1",
        plafond : 5792,
        taux : 100,
        points_retraite:0,
        commentaire:"aucun point retraite",
      },
      {
        label: "Tranche 2",
        plafond : 11585,
        taux : 75,
        points_retraite:9,
        commentaire:"9 points retraite",
      },
      {
        label: "Tranche 3",
        plafond :  17377,
        taux :50,
        commentaire:"18 points retraite",
        points_retraite:18
      },
      {
        label: "Tranche 4",
        plafond : 23170,
        taux : 25,
        points_retraite:27,
        commentaire:"27 points retraite"
      }
    ]
  };

  parametres.charges.prevoyance = {
    organisme:'CIPAV',
    label: "Invalidité Décès",
    type_tranches:'exclusive',
    commentaire:"de 76 à 380 euros selon votre choix de classe A, B ou C",
    classes: [
      {
        classe: 'A',
        label: 'Classe A',
        montant_forfaitaire: 76
      },
      {
        classe: 'B',
        label: 'Classe B',
        montant_forfaitaire: 228
      },
      {
        classe: 'C',
        label: 'Classe C',
        montant_forfaitaire: 380
      }
    ]
  };

  // les professions libérales ne cotisent pas pour les indemnités journalières
  // source : http://www.rsi.fr/baremes/charges.html
  //parametres.charges.indemnitesJournalieres = {};

  return parametres;

});

