/**
 * Création du module angular
 */
angular.module('calculator', ['core']);

// ajout des fichiers du module calculator
require('./config/chargesConfig');
require('./services/chargesTranchesCalculatorService');
require('./services/chargesCalculatorService');
require('./states');
require('./controllers/chargesReportController');
