'use strict';

angular.module('Betennis').controller('listeMatchCtrl', ['$scope', "$state", 'MatchDataService', function ($scope, $state, MatchDataService) {
    $scope.listeMatch = null;
    $scope.ready = false;

    MatchDataService.GetData().then(function (result) {
        $scope.listeMatch = result;
    }, function (error) {
        console.log(error);
    });

    $scope.convertTime = function(timeInSeconds)
    {
        let nbHours = Math.floor(timeInSeconds / 3600);
        let nbMinutes = timeInSeconds % 60;

        if(nbHours < 10)
        {
            nbHours = "0" + nbHours;
        }

        if(nbMinutes < 10)
        {
            nbMinutes = "0" + nbMinutes;
        }

        return nbHours + "h" + nbMinutes;
    };

    $scope.convertScore = function(scoreFromZeroToThree)
    {
        switch(scoreFromZeroToThree)
        {
            case 1:
                return 15;
            case 2:
                return 30;
            case 3:
                return 40;
            default:
                return 0;
        }
    };

    $scope.goToMatchDetail = function(idMatch)
    {
        $state.go("listematch.suivimatch",{
            "id": idMatch
        });
    }

}]);




