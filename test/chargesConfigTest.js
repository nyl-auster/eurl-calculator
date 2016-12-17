// Be descriptive with titles here. The describe and it titles combined read like a sentence.
describe('chargesConfig', function() {

  beforeEach(function() {
    module('calculator');
  });

  beforeEach(inject(function (_chargesTranchesCalculatorService_, _chargesConfig_) {
    chargesCalculatorService = _chargesTranchesCalculatorService_;
    chargesConfig = _chargesConfig_;
  }));

  /*
  it("calculerMontantTranche doit retourner le montant pour d'une tranche avec taux", function() {

    chargesConfig.charges.forEach((charge) => {
      expect(charge.montant).not.toBeDefined();
    });
    expect(chargesCalculatorService.calculerMontantTranche(trancheA, baseCalcul)).toEqual(100);
  });
  */


});