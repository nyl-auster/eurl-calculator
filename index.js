/**
 * Assemblage des fichiers de notre application javascript
 */

// contrib
require('angular');
require('angular-ui-router');
require('angular-i18n/angular-locale_fr.js');
require('angular-cookies');
require('angular-chart.js');
require('angular-tooltips');

// nos modules custom angular
require('./modules/core');
require('./modules/site');
require('./modules/calculator');

// foundation
// require('jquery');
// require('foundation-sites/dist/js/foundation.js');
require('foundation-sites/dist/css/foundation.css');

// nos css custom
require('./css/app.css');
require('./css/app-mobile.css');



