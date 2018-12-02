'use strict';

// Declare app level module which depends on views, and core components

let BetennisApp = angular.module('Betennis', ['ui.router', 'ngResource']);

BetennisApp.config(['$stateProvider', "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/accueil");

    $stateProvider
        .state('accueil', {
            url: "/accueil",
            templateUrl: "pages/accueil/accueil.html"
        })

        .state('listematch', {
            url: "/listematch",
            templateUrl: "pages/listematch/listematch.html",
            controller: "listeMatchCtrl"
        })
        .state('suivimatch', {
            url: "/listematch/suivimatch/:id",
            params: {
                match: null
            },
            templateUrl: "pages/suivimatch/suivimatch.html",
            controller: "suiviMatchCtrl",
        })

}]);

BetennisApp.run(
    function (_) {
        if ('serviceWorker' in navigator) {
            console.log('TRY REGRISTER SW');
            navigator.serviceWorker
                .register('sw.js')
                .then(function () {
                    console.log('Service worker registered!');
                })
                .catch(function (err) {
                    console.log(err);
                });
        }
    }
);
BetennisApp.factory(
    "_",
    function ($window) {
        var _ = $window._;
        return (_);
    }
);