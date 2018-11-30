'use strict';

angular.module('Betennis').controller('listeMatchCtrl', ['$scope', '_', 'MatchDataService', function ($scope, _, MatchDataService) {
    $scope.coucou = 'sdfighkjsfglmlk';
    $scope.listeMatch = null;
    $scope.ready = false;

    MatchDataService.GetData().then(function (result) {
        $scope.listeMatch = result;
        console.log(result);
        console.log(result[0]);
    }, function (error) {
        console.log(error);
    })

}]);