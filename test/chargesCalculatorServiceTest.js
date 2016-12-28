// Be descriptive with titles here. The describe and it titles combined read like a sentence.
describe('chargesCalcultorServiceTest', function() {

  beforeEach(function() {
    module('calculator');
  });

  beforeEach(inject(function (_chargesTranchesCalculatorService_, _chargesConfig2016_, _chargesCalculatorService_) {
    chargesTranchesCalculatorService = _chargesTranchesCalculatorService_;
    chargesCalculatorService = _chargesCalculatorService_;
    chargesConfig = _chargesConfig2016_;
  }));

  /* ==============================
   ALLOCATIONS FAMILIALES
   ==============================  */

  it("calculer le taux de la première tranche à 2.15 des allocations familiales", function() {
    const baseCalcul = 10000;
    const params = {
      chiffreAffaireHt:0,
      chiffreAffaireTtc:0,
      remuneration:0,
      cfe:0,
      prevoyance:0
    };
    chargesCalculatorService = new chargesCalculatorService(params);
    expect(chargesCalculatorService.getAllocationsFamiliales(baseCalcul).montant).toEqual(215);
  });


  it("calculer la tranche à taux progressif des allocations familiales", function() {
    const baseCalcul = 50000;
    const params = {
      chiffreAffaireHt:0,
      chiffreAffaireTtc:0,
      remuneration:0,
      cfe:0,
      prevoyance:0
    };
    chargesCalculatorService = new chargesCalculatorService(params);
    expect(chargesCalculatorService.getAllocationsFamiliales(baseCalcul).montant).toEqual(2081.47);
  });

  it("calculer le taux de la dernière tranches à 5.25 des allocations familiales", function() {
    const baseCalcul = 100000;
    const params = {
      chiffreAffaireHt:0,
      chiffreAffaireTtc:0,
      remuneration:0,
      cfe:0,
      prevoyance:0
    };
    chargesCalculatorService = new chargesCalculatorService(params);
    expect(chargesCalculatorService.getAllocationsFamiliales(baseCalcul).montant).toEqual(5250);
  });

});