'use strict';

angular.module('Betennis').controller('listeMatchCtrl', ['$scope', "$state", 'MatchDataService', '$stateParams', '$interval', function ($scope, $state, MatchDataService, $stateParams, $interval) {
    $scope.listeMatch = null;
    $scope.listeMatchFiltre = null;
    $scope.ready = false;
    $scope.activeFilter = angular.fromJson($stateParams.idFilter);
    $scope.aucunMatchTrouve = true;
    var autoRefreshTimer;

    function disableTimer() {
        console.log('[listematch] Timer disabled');
        $interval.cancel(autoRefreshTimer);
        autoRefreshTimer = undefined;
    }

    $scope.$on("$destroy", function( event ) {
        disableTimer();
    });

    $scope.refreshPage = function()
    {
        MatchDataService.GetData().then(function (result) {
            $scope.listeMatch = result;
            $scope.listeMatchFiltre = $scope.listeMatch;
            delete $scope.listeMatch.$promise;
            delete $scope.listeMatch.$resolved;
            localStorage.setItem("liste-match", angular.toJson($scope.listeMatch));
            console.log($scope.listeMatch[0]);
            if($scope.listeMatch.length > 0)
            {
                $scope.aucunMatchTrouve = false;
            }

            $scope.filterButtonClickProcess($scope.activeFilter);
        }, function (error) {
            console.log(error);
        });
    };
    $scope.refreshPage();
    autoRefreshTimer = $interval( function(){ $scope.refreshPage(); }, 5000);


    $scope.convertTime = function (timeInSeconds) {
        let nbHours = Math.floor(timeInSeconds / 3600) % 60;
        let nbMinutes = Math.floor(timeInSeconds / 60) % 60;

        if (nbHours < 10) {
            nbHours = "0" + nbHours;
        }

        if (nbMinutes < 10) {
            nbMinutes = "0" + nbMinutes;
        }

        return nbHours + "h" + nbMinutes;
    };

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

    $scope.goToMatchDetail = function (idMatch) {
        //let match = angular.toJson($scope.listeMatch[idMatch]);
        disableTimer();

        let match = angular.toJson($scope.listeMatchFiltre[idMatch]);
        $state.go("suivimatch", {
            "id": idMatch,
            "match": match
        }, {reload: true});
    }

    $scope.filterButtonClickProcess = function(filterId)
    {
        $scope.activeFilter = filterId;
        switch($scope.activeFilter)
        {
            // Match en cours.
            case 0:
                $scope.filterCurrentMatch();
                break;
            // Match à venir.
            case 1:
                $scope.filterFutureMatch();
                break;
            // Match terminés.
            case 2:
                $scope.filterEndedMatch();
                break;
            default:
        }
    };

    $scope.filterCurrentMatch = function()
    {
        $scope.listeMatchFiltre = [];

        $scope.listeMatch.forEach(function(match){
            if(match.pointage.final == false && match.temps_partie > 0)
            {
                $scope.listeMatchFiltre.push(match);
            }
        });

        if($scope.listeMatchFiltre.length > 0)
        {
            $scope.aucunMatchTrouve = false;
        }
        else
        {
            $scope.aucunMatchTrouve = true;
        }

    };

    $scope.filterFutureMatch = function()
    {
        $scope.listeMatchFiltre = [];

        $scope.listeMatch.forEach(function(match){
            if(match.pointage.final == false && match.temps_partie == 0)
            {
                $scope.listeMatchFiltre.push(match);
            }
        });

        if($scope.listeMatchFiltre.length > 0)
        {
            $scope.aucunMatchTrouve = false;
        }
        else
        {
            $scope.aucunMatchTrouve = true;
        }

    };

    $scope.filterEndedMatch = function()
    {
        $scope.listeMatchFiltre = [];

        $scope.listeMatch.forEach(function(match){
            if(match.pointage.final == true)
            {
                $scope.listeMatchFiltre.push(match);
            }
        });

        if($scope.listeMatchFiltre.length > 0)
        {
            $scope.aucunMatchTrouve = false;
        }
        else
        {
            $scope.aucunMatchTrouve = true;
        }
        console.log($scope.listeMatchFiltre);

    };

}]);




