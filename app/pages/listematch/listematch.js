'use strict';

angular.module('Betennis').controller('listeMatchCtrl', ['$scope', '_', 'MatchDataService', function ($scope, _, MatchDataService) {
    $scope.coucou = 'sdfighkjsfglmlk';
    $scope.listeMatch = null;
    $scope.ready = false;

    MatchDataService.GetData().then(function (data) {
        $scope.listeMatch = data;
    }, function (error) {
        console.log(error);
    })

}]);