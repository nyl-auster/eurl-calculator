/**
 * Création du module angular
 */

// ajout d'une nouvelle méthode au prototype pour arrondir à
// 2 chiffres après la virgule
Number.prototype.toFixedNumber = function(x, base){
  var pow = Math.pow(base||10,x);
  return +( Math.round(this*pow) / pow );
};

angular.module('calculator', ['core', 'chart.js']);

// ajout des fichiers du module calculator
require('./config/chargesConfig2016');
require('./services/chargesTranchesCalculatorService');
require('./services/chargesCalculatorService');
require('./states');
require('./controllers/storyChargesReportController');
require('./controllers/classicChargesReportController');
