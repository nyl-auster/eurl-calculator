// Be descriptive with titles here. The describe and it titles combined read like a sentence.
describe('chargesConfig', function() {

  beforeEach(function() {
    module('calculator');
  });

  beforeEach(inject(function (_chargesTranchesCalculatorService_, _chargesConfig2016_) {
    chargesCalculatorService = _chargesTranchesCalculatorService_;
    chargesConfig = _chargesConfig2016_;
  }));


  it("les objets charges doivent avoir les clefs obligatoire", function() {
    for(charge in chargesConfig.charges) {
      expect(chargesConfig.charges[charge].organisme).toBeDefined(`propriété "organisme" manquante pour la charge ${charge}`);
      expect(chargesConfig.charges[charge].label).toBeDefined(`propriété "label" manquante pour la charge ${charge}`);
      if (charge != 'invaliditeDeces') {
        expect(chargesConfig.charges[charge].tranches).toBeDefined(
          `propriété "tranches" manquante pour la charge ${charge}`);
      }
    }

  });

  it("Les plafonds de la sécurité sociale doivent être définis avec les bonnes valeurs", function() {
    expect(chargesConfig.plafond_securite_sociale).toEqual(38616);
    expect(chargesConfig.plafond_securite_sociale_precedent).toEqual(38040);
  });

});