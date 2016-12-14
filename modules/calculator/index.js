/**
 * Création du module angular
 */
angular.module('calculator', ['core']);

// ajout des fichiers du module calculator
require('./config/calculatorConfig');
require('./services/calculatorService');
require('./states');
require('./controllers/calculatorController');
