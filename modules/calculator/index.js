/**
 * Création du module angular
 */
angular.module('calculator', ['core']);

// ajout des fichiers du module calculator
require('./parametresCalculCharges2016');
require('./states');
require('./controllers/calculatorController');
