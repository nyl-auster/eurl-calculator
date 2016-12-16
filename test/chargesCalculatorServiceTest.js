// Be descriptive with titles here. The describe and it titles combined read like a sentence.
describe('chargesCalculatorService', function() {

  const max = 999999999999999;

  beforeEach(function() {
    module('calculator');
  });

  beforeEach(inject(function (_chargesCalculatorService_, _chargesConfig_) {
    chargesCalculatorService = _chargesCalculatorService_;
    chargesConfig = _chargesConfig_;
  }));

  it("calculerMontantTranche doit retourner le montant pour d'une tranche avec taux", function() {

    let baseCalcul = 1000;
    let trancheA = {
      taux: 10,
      plafond:100000
    };

    expect(chargesCalculatorService.calculerMontantTranche(trancheA, baseCalcul)).toEqual(100);
  });

  it("calculerMontantTranche doit retourner le montant d'une tranche avec montant_forfaitaire", function() {

    let baseCalcul = 1000;
    let trancheA = {
      taux: 10,
      plafond:100000,
      montant_forfaitaire:2
    };

    expect(chargesCalculatorService.calculerMontantTranche(trancheA, baseCalcul)).toEqual(2);
  });

  it("calculerTrancheExclusive doit retourner le montant forfaitaire pour une charge avec tranche_exclusive", function() {

    let baseCalcul = 30000;
    let charge = {
      label : 'Retraite complémentaire',
      organisme: 'CIPAV',
      type_tranches : "exclusive",
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

    let result = chargesCalculatorService.calculerTrancheExclusive(baseCalcul, charge);
    expect(result.montant).toEqual(2427);

    baseCalcul = 103180;
    result = chargesCalculatorService.calculerTrancheExclusive(baseCalcul, charge);
    expect(result.montant).toEqual(13349);
  });


  it("calculerTrancheExclusive doit retourner le montant avec taux pour une charge avec tranche_exclusive", function() {

    let baseCalcul = 1000;
    let charge = {
      organisme:'URSSAF',
      type_tranches: 'tranche_exclusive',
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

    let result = chargesCalculatorService.calculerTrancheExclusive(baseCalcul, charge);
    expect(result.montant).toEqual(65);
  });

  it("calculerTranchesCumulatives doivent cumuler le montant de chaque tranche en fonction du taux", function() {


    let baseCalcul = 50000;
    let charge = {
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
          taux: 33
        }
      ]
    };

    let result = chargesCalculatorService.calculerTranchesCumulatives(baseCalcul, charge);
    // 38120 * 0.15 = 5718
    // 50 000 - 38120 = 11880
    // 11880 * 0.33 = 3920.4
    // 5718 + 3920.4 = 9638.4
    expect(result.montant).toEqual(9638.4);
  });

});