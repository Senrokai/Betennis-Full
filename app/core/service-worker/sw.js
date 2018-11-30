const version = 'v1';
let log = console.log.bind(console);

self.addEventListener('install', function (event){
    log(`${version} installed at ${ new Date().toLocaleTimeString()}`);
    event.waitUntil(
        caches.open(version)
            .then(cache => {
                return cache.addAll([
                    '../../lib/angular/angular.min.js',
                    '../../lib/bootstrap/dist/css/bootstrap.min.css',
                    '../../lib/bootstrap/dist/js/bootstrap.min.js',
                    '../../lib/@uirouter/angularjs/release/angular-ui-router.min.js',
                    '../../lib/lodash/lodash.min.js',
                    '../../core/ressources/MatchRessources.js',
                    '../../core/ressources/PariRessources.js',
                    '../../core/services/MatchDataService.js',
                    '../../pages/accueil/accueil.html',
                    '../../pages/listematch/listematch.html',
                    '../../pages/listematch/listematch.js',
                    '../../pages/suivimatch/suivimatch.html',
                    '../../pages/suivimatch/suivimatch.js',
                    '../../app.css',
                    '../../app.js',
                    '../../index.html'
                ]);
            }));
});

self.addEventListener('activate', function (event){
    log(`${version} activated at ${ new Date().toLocaleTimeString()}`);

    event.waitUntil(
        caches.keys()
            .then(keys => {
                return Promise.all(keys.filter(function (key) {
                    return key !== version;
                })
                    .map(key => {
                        log(`Cleaning up the cache key ${key}`);
                        return caches.delete(key);
                    }));
            }));
});

self.addEventListener('fetch', function (event) {

    event.respondWith(
        caches.match(event.request)
            .then(res => {

                if (res) {
                    log(`${res.url} is actually coming from the cache now....`);
                    return res;
                }

                if (!navigator.onLine) {
                    return caches.match(new Request('accueil.offline.html'));
                }

                return _fetchAndUpdate(event.request);
            })

    );
});

//  The purpose of this function is to automatically take any reponse and put it into the
//  service worker cache, this means that any part of our site that has been navigated to
//  online will be accessible if the user is suddenly taken offline.
function _fetchAndUpdate(request) {
    return fetch (request)
        .then(res => {
            if (res) {
                return caches.open(version)
                    .then(cache => {

                        //  We don't want to cache the data that is coming from the service!
                        if (request.url.includes("api/ListeMatch")) {
                            return cache.put(request, res.clone())
                                .then(() => {
                                    return res;
                                });
                        }
                        else {
                            return res;
                        }
                    })
            }
        });
}