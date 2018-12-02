'use strict';

angular.module('Betennis').controller('suiviMatchCtrl', ['$scope', '_', "$stateParams", function ($scope, _, $stateParams) {
    $scope.match = angular.fromJson($stateParams.match);
    if($scope.match===null) {
        $scope.match = angular.fromJson(localStorage.getItem("liste-match"))[$stateParams.id];
    }
    console.log($scope.match);

    $scope.convertScore = function (scoreFromZeroToThree) {
        switch (scoreFromZeroToThree) {
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

    $scope.convertTime = function (timeInSeconds) {
        let nbHours = Math.floor(timeInSeconds / 3600);
        let nbMinutes = timeInSeconds % 60;

        if (nbHours < 10) {
            nbHours = "0" + nbHours;
        }

        if (nbMinutes < 10) {
            nbMinutes = "0" + nbMinutes;
        }

        return nbHours + "h" + nbMinutes;
    };

    $scope.displayResult = function(nbOfSet)
    {
        if(nbOfSet >= 2)
        {
            return "win";
        }
        else
        {
            return "lose";
        }
    }
}]);