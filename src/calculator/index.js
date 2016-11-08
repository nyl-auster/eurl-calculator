/**
 * Création du module angular
 */

// le module calculator requiert le module "core".
require('../core');

angular.module('calculator', ['core']);

// ajout des fichiers du module calculator
require('./states');
require('./controllers/indexController');
