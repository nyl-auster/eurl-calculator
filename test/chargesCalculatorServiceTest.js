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

});