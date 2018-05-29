'use strict';

let _dbPromise = undefined;
const DATABASE = 'restaurant-reviews';
const RESTAURANTS_OBJECT_STORE = 'restaurants';
const NEIGHBORHOODS_OBJECT_STORE = 'neighborhoods';
const CUISINES_OBJECT_STORE = 'cuisines';

/**
 * IndexDB database helper functions.
 */
class IndexDBHelper { // eslint-disable-line no-unused-vars

    /**
     * Create the IndexDB database
     */
    static openDatabase() {
        if (!navigator.serviceWorker) return;

        _dbPromise = idb.open(DATABASE, 2, (upgradeDB) => { // eslint-disable-line no-undef
            /* eslint-disable */
            switch (upgradeDB.oldVersion) {
                case 0:
                    var store = upgradeDB.createObjectStore(RESTAURANTS_OBJECT_STORE, {
                        keyPath: 'id'
                    });
                    store.createIndex('by-date', 'createdAt');
                case 1:
                    upgradeDB.createObjectStore(NEIGHBORHOODS_OBJECT_STORE, {
                        autoIncrement: true
                    });
                    upgradeDB.createObjectStore(CUISINES_OBJECT_STORE, {
                        autoIncrement: true
                    });
            }
            /* eslint-enable */
        });
    }

    static storeRestaurants(restaurants) {
        _dbPromise.then((db) => {
            if (!db) return;

            const tx = db.transaction(RESTAURANTS_OBJECT_STORE, 'readwrite');
            const store = tx.objectStore(RESTAURANTS_OBJECT_STORE);
            restaurants.forEach(function(restaurant) {
                store.put(restaurant);
            });
        });
    }

    static storeCuisines(cuisines) {
        _dbPromise.then((db) => {
            if (!db) return;

            const tx = db.transaction(CUISINES_OBJECT_STORE, 'readwrite');
            const store = tx.objectStore(CUISINES_OBJECT_STORE);
            cuisines.forEach(function(cuisine) {
                store.put(cuisine);
            });
        });
    }

    static storeNeighborhoods(neighborhoods) {
        _dbPromise.then((db) => {
            if (!db) return;

            const tx = db.transaction(NEIGHBORHOODS_OBJECT_STORE, 'readwrite');
            const store = tx.objectStore(NEIGHBORHOODS_OBJECT_STORE);
            neighborhoods.forEach(function(neighborhood) {
                store.put(neighborhood);
            });
        });
    }

    static showCachedRestaurants() {
        return _dbPromise.then(function(db) {
            if (!db) return;

            var index = db.transaction(RESTAURANTS_OBJECT_STORE)
                .objectStore(RESTAURANTS_OBJECT_STORE).index('by-date');

            return index.getAll();
        });
    }

    static showCachedCuisines() {
        return _dbPromise.then(function(db) {
            if (!db) return;

            return db.transaction(CUISINES_OBJECT_STORE)
                .objectStore(CUISINES_OBJECT_STORE)
                .getAll();
        });
    }

    static showCachedNeighborhoods() {
        return _dbPromise.then(function(db) {
            if (!db) return;

            return db.transaction(NEIGHBORHOODS_OBJECT_STORE)
                .objectStore(NEIGHBORHOODS_OBJECT_STORE)
                .getAll();
        });
    }
}
