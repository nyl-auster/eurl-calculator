// Be descriptive with titles here. The describe and it titles combined read like a sentence.
describe('chargesConfig', function() {

  beforeEach(function() {
    module('calculator');
  });

  beforeEach(inject(function (_chargesTranchesCalculatorService_, _chargesConfig_) {
    chargesCalculatorService = _chargesTranchesCalculatorService_;
    chargesConfig = _chargesConfig_;
  }));


  it("les charges doivent avoir les clefs attendues", function() {
    for(charge in chargesConfig.charges) {
      expect(chargesConfig.charges[charge].organisme).toBeDefined(`propriété "organisme" manquante pour la charge ${charge}`);
      expect(chargesConfig.charges[charge].label).toBeDefined(`propriété "label" manquante pour la charge ${charge}`);
      if (charge != 'invaliditeDeces') {
        expect(chargesConfig.charges[charge].tranches).toBeDefined(
          `propriété "tranches" manquante pour la charge ${charge}`);
      }
    }

  });



});