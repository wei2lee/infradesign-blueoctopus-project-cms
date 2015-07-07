/**
 * INSPINIA - Responsive Admin Theme
 *
 */
(function () {
    angular.module('inspinia', [
            'ParseServices',
            'ui.router', // Routing
            'oc.lazyLoad',
            'ui.bootstrap', // Bootstrap
            'ngIdle',
            'countrySelect',
            'ngCookies'
        ]);
})();