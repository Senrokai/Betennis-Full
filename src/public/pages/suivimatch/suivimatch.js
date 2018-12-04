'use strict';

angular.module('Betennis').controller('suiviMatchCtrl', ['$scope', '_', "$stateParams", "$uibModal", '$location', '$http', 'MatchDataService',

    function ($scope, _, $stateParams, $uibModal,  $location, $http, MatchDataService) {

        $scope.match = angular.fromJson($stateParams.match);
        if ($scope.match === null) {
            $scope.match = angular.fromJson(localStorage.getItem("liste-match"))[$stateParams.id];
        }


        $scope.betValue = 0;
        $scope.modalInstance = null;
        $scope.playerToBet = 0;

        console.log($scope.match);

    $scope.refreshPage = function()
    {

        MatchDataService.GetData().then(function (result) {
            $scope.listeMatch = result;
            $scope.match = $scope.listeMatch[$stateParams.id];
            delete $scope.listeMatch.$promise;
            delete $scope.listeMatch.$resolved;
            localStorage.setItem("liste-match", angular.toJson($scope.listeMatch));
            $scope.refreshBet();

        }, function (error) {
            console.log(error);
        });
    };

    $scope.refreshBet = function()
    {
        if($scope.match.pointage.manches[0] == 0 && $scope.match.pointage.manches[1] == 0 && $scope.match.userParis.joueur == null)
        {
            $scope.betButtonDisabled = false;
            $scope.paris = "Veuillez parier pour connaitre votre gain potentiel.";
        }
        else if($scope.match.userParis.joueur != null)
        {
            $scope.betButtonDisabled = true;

            let joueurParis = "unknown";
            if($scope.match.userParis.joueur == 0)
            {
                joueurParis = $scope.match.joueur1.prenom + " " + $scope.match.joueur1.nom;
            }
            else if($scope.match.userParis.joueur == 1)
            {
                joueurParis = $scope.match.joueur2.prenom + " " + $scope.match.joueur2.nom;
            }
            $scope.paris = "Vous avez parier " + $scope.match.userParis.montant + " sur le joueur " + joueurParis + ".";

        }
        else
        {
            $scope.betButtonDisabled = true;
            $scope.paris = "Vous ne pouvez plus parier sur ce match, une manche a déjà été complétée.";
        }

        if($scope.match.pointage.final == true)
        {
            if(($scope.match.pointage.manches[0] == 2 && $scope.match.userParis.joueur == 0) || ($scope.match.pointage.manches[1] == 2 && $scope.match.userParis.joueur == 1))
            {
                $scope.paris = "Le match est terminé, vous avez gagné votre paris sur ";

            }
            else
            {
                $scope.paris = "Le match est terminé, vous avez perdu votre paris sur ";
            }

            if($scope.match.userParis.joueur == 0)
            {
                $scope.paris = $scope.paris + $scope.match.joueur1.prenom + " " + $scope.match.joueur1.nom;
            }
            else
            {
                $scope.paris = $scope.paris + $scope.match.joueur2.prenom + " " + $scope.match.joueur2.nom;
            }
        }
    };
    $scope.refreshBet();

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

        $scope.displayResult = function (nbOfSet) {
            if (nbOfSet >= 2) {
                return "gagnant";
            } else {
                return "perdant";
            }
        };

        $scope.cancelBet = function () {
            $scope.$parent.modalInstance.dismiss('cancel');
        };

        $scope.validBet = function () {
            $scope.$parent.modalInstance.close($scope.betValue);
        };

        $scope.sendBet = function () {
            let url = 'api/parties/' + $stateParams.id + '/paris/' + $scope.playerToBet + '/' + $scope.betValue;
            $http.put(url, null).then(function (res) {
                    console.log(res);
                    $scope.refreshPage();
                },
                function (error) {
                    console.log(error);
                    $scope.refreshPage();
                }
            );
        };
    }]);