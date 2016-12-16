// Be descriptive with titles here. The describe and it titles combined read like a sentence.
describe('chargesCalculatorService', function() {

  beforeEach(function() {
    module('calculator');
  });

  beforeEach(inject(function (_chargesCalculatorService_, _chargesConfig_) {
    chargesCalculatorService = _chargesCalculatorService_;
    chargesConfig = _chargesConfig_;
  }));

  it("doit retourner le montant pour d'une tranche avec taux", function() {

    baseCalcul = 1000;
    var trancheA = {
      taux: 10,
      plafond:100000
    };

    expect(chargesCalculatorService.calculerMontantTranche(trancheA, baseCalcul)).toEqual(100);
  });

  it("doit retourner le montant d'une tranche avec montant_forfaitaire", function() {

    baseCalcul = 1000;
    var trancheA = {
      taux: 10,
      plafond:100000,
      montant_forfaitaire:2
    };

    expect(chargesCalculatorService.calculerMontantTranche(trancheA, baseCalcul)).toEqual(2);
  });

  it("doit retourner le montant pour une charge avec tranche_exclusive", function() {

    baseCalcul = 30000;
    charge = {
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
          plafond : 999999999999,
          montant_forfaitaire : 15776,
          points_retraite : 468
        }
      ]
    };

    var result = chargesCalculatorService.calculerTrancheExclusive(baseCalcul, charge);
    expect(result.montant).toEqual(2427);

    baseCalcul = 103180;
    var result = chargesCalculatorService.calculerTrancheExclusive(baseCalcul, charge);
    expect(result.montant).toEqual(13349);
  });

});