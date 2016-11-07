/**
 * Création du module
 */
var module = angular.module('calculatorApp', ['coreApp']);

// inclusion des fichiers du modules
require('./controllers/indexController.js');
require('./states.js');
