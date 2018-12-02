'use strict';

angular.module('Betennis').controller('suiviMatchCtrl', ['$scope', '_', "$stateParams", function ($scope, _, $stateParams) {
    $scope.match = angular.fromJson($stateParams.match);
    if($scope.match===null) {
        $scope.match = angular.fromJson(localStorage.getItem("liste-match"))[$stateParams.id];
    }
}]);