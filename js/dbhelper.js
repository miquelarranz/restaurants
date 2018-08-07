'use strict';

/**
 * Common database helper functions.
 */
class DBHelper { // eslint-disable-line no-unused-vars

    /**
     * Database URL.
     * Change this to restaurants.json file location on your server.
     */
    static get RESTAURANTS_URL() {
        return 'http://localhost:1337/restaurants';
    }

    static get REVIEWS_URL() {
        return 'http://localhost:1337/reviews';
    }


    /**
     * Fetch all restaurants.
     */
    static fetchRestaurants(callback) {
        fetch(DBHelper.RESTAURANTS_URL)
            .then(function(response) {
                return response.json();
            })
            .then(function(restaurants) {
                console.log(1, restaurants);
                callback(null, restaurants);
            })
            .catch(function(error) {
                callback(error);
            });
    }

    /**
     * Fetch a restaurant by its ID.
     */
    static fetchRestaurantById(id, callback) {
        fetch(`${DBHelper.RESTAURANTS_URL}/${id}`)
            .then(function(response) {
                return response.json();
            })
            .then(function(restaurant) {
                callback(null, restaurant);
            })
            .catch(function(error) {
                callback(error);
            });
    }

    /**
     * Fetch restaurants by a cuisine type with proper error handling.
     */
    static fetchRestaurantByCuisine(cuisine, callback) {
        // Fetch all restaurants  with proper error handling
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Filter restaurants to have only given cuisine type
                const results = restaurants.filter(r => r.cuisine_type == cuisine);
                callback(null, results);
            }
        });
    }

    /**
     * Fetch restaurants by a neighborhood with proper error handling.
     */
    static fetchRestaurantByNeighborhood(neighborhood, callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Filter restaurants to have only given neighborhood
                const results = restaurants.filter(r => r.neighborhood == neighborhood);
                callback(null, results);
            }
        });
    }

    /**
     * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
     */
    static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                let results = restaurants;
                if (cuisine != 'all') { // filter by cuisine
                    results = results.filter(r => r.cuisine_type == cuisine);
                }
                if (neighborhood != 'all') { // filter by neighborhood
                    results = results.filter(r => r.neighborhood == neighborhood);
                }
                callback(null, results);
            }
        });
    }

    /**
     * Fetch all neighborhoods with proper error handling.
     */
    static fetchNeighborhoods(callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Get all neighborhoods from all restaurants
                const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
                // Remove duplicates from neighborhoods
                const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
                callback(null, uniqueNeighborhoods);
            }
        });
    }

    /**
     * Fetch all cuisines with proper error handling.
     */
    static fetchCuisines(callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Get all cuisines from all restaurants
                const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
                // Remove duplicates from cuisines
                const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
                callback(null, uniqueCuisines);
            }
        });
    }

    /**
     * Fetch the reviews of a restaurant.
     */
    static fetchReviewsByRestaurant(id, callback) {
        fetch(`${DBHelper.REVIEWS_URL}/?restaurant_id=${id}`)
            .then(function(response) {
                return response.json();
            })
            .then(function(reviews) {
                callback(null, reviews);
            })
            .catch(function(error) {
                callback(error);
            });
    }

    /**
     * Add a new review.
     */
    static addReview(id, name, rating, comments, callback) {
        fetch(`${DBHelper.REVIEWS_URL}/`, {
            method: 'post',
            body: JSON.stringify({
                restaurant_id: id,
                name: name,
                rating: rating,
                comments: comments,
            })
        })
            .then(function(response) {
                return response.json();
            })
            .then(function(review) {
                callback(null, review);
            })
            .catch(function(error) {
                callback(error);
            });
    }

    /**
     * Restaurant page URL.
     */
    static urlForRestaurant(restaurant) {
        return (`./restaurant.html?id=${restaurant.id}`);
    }

    /**
     * Restaurant image URL.
     */
    static imageUrlForRestaurant(restaurant) {
        return (`./img/${restaurant.photograph}.webp`);
    }

    /**
     * Map marker for a restaurant.
     */
    static mapMarkerForRestaurant(restaurant, map) {
        const marker = new google.maps.Marker({ // eslint-disable-line no-undef
            position: restaurant.latlng,
            title: restaurant.name,
            url: DBHelper.urlForRestaurant(restaurant),
            map: map,
            animation: google.maps.Animation.DROP // eslint-disable-line no-undef
        });
        return marker;
    }

}
