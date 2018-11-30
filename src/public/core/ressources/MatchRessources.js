'use script';

angular.module("Betennis").factory('MatchRessources', ['$resource', function ($resource) {
    return $resource('api/parties/', null, {
            getMatchList: {
                method: 'GET',
                isArray: true
            }
        }
    );
}]);