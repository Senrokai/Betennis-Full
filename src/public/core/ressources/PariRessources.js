'use script';

angular.module("Betennis").factory('PariRessources', ['$resource', function ($resource) {
    return $resource('api/parties/:id/paris', null, {
            getParis: {
                method: 'GET',
                isArray: true
            },
            placerPari: {
                url: 'api/parties/:id/paris/:joueur/:montant',
                method: 'POST'
            }
        }
    );
}]);