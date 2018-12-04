'use strict';

angular.module('Betennis').controller('suiviMatchCtrl', ['$scope', '_', "$stateParams", "$uibModal", 'PariRessources', '$location', '$http',

    function ($scope, _, $stateParams, $uibModal, PariRessources, $location, $http) {
        $scope.match = angular.fromJson($stateParams.match);
        if ($scope.match === null) {
            $scope.match = angular.fromJson(localStorage.getItem("liste-match"))[$stateParams.id];
        }
        if($scope.match.pointage.manches[0] == 0 && $scope.match.pointage.manches[1] == 0)
        {
            $scope.betButtonDisabled = false;
        }
        else
        {
            $scope.betButtonDisabled = true;
        }
        $scope.urlParams = $location.path().split('/');
        $scope.matchId = $scope.urlParams[$scope.urlParams.length - 1];
        $scope.betValue = 0;
        $scope.modalInstance = null;
        $scope.playerToBet = 0;



    $scope.openBetModalPlayer1 = function (size, parentSelector) {

        $scope.playerToBet = 0;

        let parentElem = parentSelector ? angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;

        $scope.modalInstance = $uibModal.open({
            animation: this.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'betModalPlayer1.html',
            controller: 'suiviMatchCtrl',
            size: size,
            scope: $scope,
            appendTo: parentElem,
            resolve: {
                betValue: function () {
                    return $scope.betValue;
                }
            }
        });

        $scope.modalInstance.result.then(function (result) {
            console.log("Modal validé");
            $scope.betValue = result;
            $scope.sendBet();
        }, function () {
            console.log("Modal annulé");
        });
    };

    $scope.openBetModalPlayer2 = function (size, parentSelector) {

        $scope.playerToBet = 1;

        let parentElem = parentSelector ? angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;

        $scope.modalInstance = $uibModal.open({
            animation: this.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'betModalPlayer2.html',
            controller: 'suiviMatchCtrl',
            size: size,
            scope: $scope,
            appendTo: parentElem,
            resolve: {
                betValue: function () {
                    return $scope.betValue;
                }
            }
        });

        $scope.modalInstance.result.then(function (result) {
            console.log("Modal validé");
            $scope.betValue = result;
            $scope.sendBet();
        }, function () {
            console.log("Modal annulé");
        });
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

    $scope.convertTime = function (timeInSeconds) {
        let nbHours = Math.floor(timeInSeconds / 3600);
        let nbMinutes = Math.floor(timeInSeconds / 60);

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
            return "gagnant";
        }
        else
        {
            return "perdant";
        }
    };

    $scope.cancelBet = function()
    {
        $scope.$parent.modalInstance.dismiss('cancel');
    };

    $scope.validBet = function()
    {
        $scope.$parent.modalInstance.close($scope.betValue);
    };

    $scope.sendBet = function()
    {
        let url = 'api/parties/' + $scope.matchId + '/paris/' + $scope.playerToBet + '/' + $scope.betValue;
        $http.put(url);
        /*
        PariRessources.placerPari({id:$scope.matchId, joueur:$scope.playerToBet, montant:$scope.betValue}).$promise.then(
            function(){
                console.log("success");
            },
            function(){
                console.log("error");
            }
        );
        */
    };
}]);