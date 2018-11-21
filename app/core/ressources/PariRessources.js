'use script';

angular.module("Betennis").factory('PariRessources', ['$resource', function ($resource) {
    return $resource('api/PariMatch', null, {
            getParis: {
                method: 'GET',
                isArray: true
            },
            placerPari: {
                url: 'api/PariMatch/create',
                method: 'POST'
            }
        }
    );
}]);