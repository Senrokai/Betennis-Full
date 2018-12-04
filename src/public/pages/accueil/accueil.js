'use strict';

angular.module('Betennis').controller('accueilCtrl', ['$scope', "$state", function ($scope, $state) {

    $scope.displayMatchList = function(idFilter)
    {
        $state.go("listematch", {
            "idFilter": idFilter,
        });
    };
}]);