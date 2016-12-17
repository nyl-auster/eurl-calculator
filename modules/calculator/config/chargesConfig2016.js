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
 *   http://www.cnavpl.fr/les-chiffres-cles/principaux-parametres-du-regime-de-base/principaux-parametres-variables-du-regime-de-base/
 *   https://www.urssaf.fr/portail/home/taux-et-baremes/taux-de-cotisations/les-professions-liberales/bases-de-calcul-et-taux-des-coti.html
 *   https://www.rsi.fr/cotisations/professions-liberales/presentation-des-cotisations.html
 *
 * Le RSI gère uniquement votre protection santé maladie-maternité.
 * la retraite et l'invalidité décès sont assurées par la CNAVPL ou la CNBF
 * les cotisations d'allocations familiales, les contributions sociales (CSG/CRDS) et les contributions à la formation professionnelle sont à verser à l'Urssaf
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
  parametres.plafond_securite_sociale_precedent = 38040;

  // URSSAF : MALADIE-MATERNITE
  parametres.charges.maladiesMaternite = {
    organisme:'URSSAF',
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

  // URSSAF : FORMATION PROFESSIONNELLE
  parametres.charges.formationProfessionnelle = {
    organisme: 'URSSAF',
    label: 'Formation professionnelle',
    commentaire: "Base de calcul : Sur la base de " + parametres.plafond_securite_sociale + " €  . Cotisation à verser en 2016. Si votre conjoint a opté pour le statut de conjoint collaborateur, le taux est de 0,34 %",
    type_tranches: 'exclusive',
    tranches: [
      {
        label: "Tranche 1",
        taux: 25,
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
    type_tranches: 'batarde',
    description: "Retraite de base CNAVPL",
    commentaire: "En cas de revenus non connus : 3 178 € (maximum de la tranche 1) ; 3 611 € (maximum de la tranche 2)",
    tranches: [
      // sous 4441, montant forfaitaire
      {
        label:"Tranche 1",
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

  // TVA 20%
  parametres.charges.tva20 = {
    label: "TVA",
    organisme: "Impots",
    type_tranches: "exclusive",
    tranches: [
      {
        label:"TVA 20%",
        plafond:parametres.plafondMax,
        taux:20
      }
    ]
  };

  // La taxe foncière dont le montant forfaitaire dépend de la ville
  parametres.charges.cfe = {
    label: "CFE",
    organisme: "Impots locaux",
    type_tranches: "exclusive",
    tranches: [
      {
        label: "Tranche 1",
        plafond:parametres.plafondMax,
        montant_forfaitaire: null
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

  parametres.charges.invaliditeDeces = {
    organisme:'CIPAV',
    label: "Invalidité Décès",
    type_tranches:'exclusive',
    tranches:[
      {
        label: 'A',
        montant_forfaitaire: 76
      },
      {
        label: 'B',
        montant_forfaitaire: 228
      },
      {
        label: 'C',
        montant_forfaitaire: 380
      }
    ]
  };

  // les professions libérales ne cotisent pas pour les indemnités journalières
  // source : http://www.rsi.fr/baremes/charges.html
  //parametres.charges.indemnitesJournalieres = {};

  return parametres;

});

