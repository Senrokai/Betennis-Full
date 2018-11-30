'use script';

angular.module('Betennis').service('MatchDataService', ['$http', '$q','MatchRessources',function ($http, $q, MatchRessources) {
        return {
            GetData : function () {
                if (!navigator.onLine) {
                    return $q((resolve, reject) => {
                        if (localStorage.getItem('liste-match') === null) {
                            reject(null);
                        }
                        else {
                            resolve(JSON.parse(localStorage.getItem('liste-match')));
                        }
                    });
                }
                else {
                    return $q.resolve(MatchRessources.getMatchList());
                }
            }
        }
    }]);