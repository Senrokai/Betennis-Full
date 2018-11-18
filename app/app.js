'use strict';

// Declare app level module which depends on views, and core components

var BetennisApp = angular.module('Betennis', ['ui.router']);

BetennisApp.config(['$stateProvider', "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/accueil");

    $stateProvider
        .state('accueil', {
            url: "/accueil",
            templateUrl:"pages/accueil/accueil.html"
        })
        .state('listematch', {
            url:"/listematch",
            templateUrl:"pages/listematch/listematch.html",
            controller: "listeMatchCtrl"
        })
        .state('listematch.suivimatch', {
            url:"/suivimatch",
            templateUrl:"pages/suivimatch/suivimatch.html",
            controller: "suiviMatchCtrl"
        })
}]);

BetennisApp.run(
    function( _ ) {
    }
);
BetennisApp.factory(
    "_",
    function( $window ) {
        var _ = $window._;
        return( _ );
    }
);