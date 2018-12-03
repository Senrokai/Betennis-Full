'use strict';

angular.module('Betennis').controller('suiviMatchCtrl', ['$scope', '_', "$stateParams", "$uibModal",

    function ($scope, _, $stateParams, $modalInstance) {
    $scope.match = angular.fromJson($stateParams.match);
    if($scope.match===null) {
        $scope.match = angular.fromJson(localStorage.getItem("liste-match"))[$stateParams.id];
    }
    console.log($scope.match);
    $scope.instance = null;


    $scope.openModal = function (size, parentSelector, playerToBet) {

        var parentElem = parentSelector ?
            angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        var modalInstance = $modalInstance.open({
            animation: this.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'modalparis.html',
            controller: 'suiviMatchCtrl',
            controllerAs: '$ctrl',
            size: size,
            appendTo: parentElem,
            resolve: {
                items: function () {
                    return null;//this.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            this.selected = selectedItem;
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
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

    $scope.openBetModal = function()
    {

            $scope.instance = $modalInstance.open({
                animation: this.animationsEnabled,
                ariaLabelledBy: 'modal-title-top',
                ariaDescribedBy: 'modal-body-top',
                controller: 'suiviMatchCtrl',
                size: 'sm',
                templateUrl: 'pages/suivimatch/modalparis.html'
            });

            $scope.instance.result.then(function () {

            }, function () {

            });

    }

    $scope.annulerParis = function(result)
    {
        $scope.instance.close(result);
    }

    $scope.validerParis = function()
    {
        $scope.instance.close();
    }
}]);