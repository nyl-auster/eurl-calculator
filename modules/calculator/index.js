/**
 * Création du module angular
 */
angular.module('calculator', ['core']);

// ajout des fichiers du module calculator
require('./config/chargesConfig');
require('./services/chargesCalculator');
require('./states');
require('./controllers/calculatorController');
