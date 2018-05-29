'use strict';

const self = {
    restaurants: [],
    neighborhoods: [],
    cuisines: [],
    map: undefined,
    markers: [],
};

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
// document.addEventListener('DOMContentLoaded', () => {
function initializeView() {
    IndexDBHelper.openDatabase(); // eslint-disable-line no-undef

    IndexDBHelper.showCachedRestaurants().then((restaurants) => { // eslint-disable-line no-undef
        fillRestaurantsHTML(restaurants);
        updateRestaurants();
    });

    IndexDBHelper.showCachedCuisines().then((cuisines) => { // eslint-disable-line no-undef
        fillCuisinesHTML(cuisines);
        fetchCuisines();
    });

    IndexDBHelper.showCachedNeighborhoods().then((neighborhoods) => { // eslint-disable-line no-undef
        fillNeighborhoodsHTML(neighborhoods);
        fetchNeighborhoods();
    });
}

/**
 * Fetch all neighborhoods and set their HTML.
 */
function fetchNeighborhoods() {
    DBHelper.fetchNeighborhoods((error, neighborhoods) => { // eslint-disable-line no-undef
        if (error) { // Got an error
            console.error(error);
        } else {
            self.neighborhoods = neighborhoods;
            IndexDBHelper.storeNeighborhoods(neighborhoods); // eslint-disable-line no-undef
            resetNeighborhoods();
            fillNeighborhoodsHTML();
        }
    });
}

function resetNeighborhoods() {
    const select = document.getElementById('neighborhoods-select');
    select.innerHTML = '';
}

/**
 * Set neighborhoods HTML.
 */
function fillNeighborhoodsHTML(neighborhoods) {
    if (!neighborhoods) {
        neighborhoods = self.neighborhoods;
    }

    const select = document.getElementById('neighborhoods-select');
    neighborhoods.forEach(neighborhood => {
        const option = document.createElement('option');
        option.innerHTML = neighborhood;
        option.value = neighborhood;

        select.append(option);
    });
}

/**
 * Fetch all cuisines and set their HTML.
 */
function fetchCuisines() {
    DBHelper.fetchCuisines((error, cuisines) => { // eslint-disable-line no-undef
        if (error) { // Got an error!
            console.error(error);
        } else {
            self.cuisines = cuisines;
            IndexDBHelper.storeCuisines(cuisines); // eslint-disable-line no-undef
            resetCuisines();
            fillCuisinesHTML();
        }
    });
}

function resetCuisines() {
    const select = document.getElementById('cuisines-select');
    select.innerHTML = '';
}

/**
 * Set cuisines HTML.
 */
function fillCuisinesHTML(cuisines) {
    if (!cuisines) {
        cuisines = self.cuisines;
    }

    const select = document.getElementById('cuisines-select');

    cuisines.forEach(cuisine => {
        const option = document.createElement('option');
        option.innerHTML = cuisine;
        option.value = cuisine;
        select.append(option);
    });
}

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
    let loc = {
        lat: 40.722216,
        lng: -73.987501
    };

    self.map = new google.maps.Map(document.getElementById('map'), { // eslint-disable-line no-undef
        zoom: 12,
        center: loc,
        scrollwheel: false
    });

    initializeView();
};

/**
 * Update page and map for current restaurants.
 */
function updateRestaurants() {
    const cSelect = document.getElementById('cuisines-select');
    const nSelect = document.getElementById('neighborhoods-select');

    const cIndex = cSelect.selectedIndex;
    const nIndex = nSelect.selectedIndex;

    const cuisine = cSelect[cIndex].value;
    const neighborhood = nSelect[nIndex].value;

    DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => { // eslint-disable-line no-undef
        if (error) { // Got an error!
            console.error(error);
        } else {
            resetRestaurants(restaurants);
            fillRestaurantsHTML();

            IndexDBHelper.storeRestaurants(restaurants); // eslint-disable-line no-undef
        }
    });
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
function resetRestaurants(restaurants) {
    // Remove all restaurants
    self.restaurants = [];
    const ul = document.getElementById('restaurants-list');
    ul.innerHTML = '';

    // Remove all map markers
    self.markers.forEach(m => m.setMap(null));
    self.markers = [];
    self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
function fillRestaurantsHTML(restaurants) {
    if (!restaurants) {
        restaurants = self.restaurants;
    }

    const ul = document.getElementById('restaurants-list');
    restaurants.forEach(restaurant => {
        ul.append(createRestaurantHTML(restaurant));
    });
    addMarkersToMap(restaurants);
}

/**
 * Create restaurant HTML.
 */
function createRestaurantHTML(restaurant) {
    const li = document.createElement('li');
    const restaurantContainer = document.createElement('div');

    const image = document.createElement('img');
    image.className = 'restaurant-img';
    image.src = DBHelper.imageUrlForRestaurant(restaurant); // eslint-disable-line no-undef
    image.alt = restaurant.image_description;
    restaurantContainer.append(image);

    const nameLink = document.createElement('a');
    nameLink.href = DBHelper.urlForRestaurant(restaurant); // eslint-disable-line no-undef
    const name = document.createElement('h2');
    name.innerHTML = restaurant.name;
    nameLink.append(name);
    restaurantContainer.append(nameLink);

    const neighborhood = document.createElement('p');
    neighborhood.innerHTML = restaurant.neighborhood;
    restaurantContainer.append(neighborhood);

    const address = document.createElement('p');
    address.innerHTML = restaurant.address;
    restaurantContainer.append(address);

    // const more = document.createElement('a');
    // more.innerHTML = 'View Details';
    // more.href = DBHelper.urlForRestaurant(restaurant);
    // restaurantContainer.append(more)

    li.append(restaurantContainer);

    return li;
}

/**
 * Add markers for current restaurants to the map.
 */
function addMarkersToMap(restaurants) {
    if (!restaurants) {
        restaurants = self.restaurants;
    }

    restaurants.forEach(restaurant => {
        // Add marker to the map
        const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map); // eslint-disable-line no-undef
        google.maps.event.addListener(marker, 'click', () => { // eslint-disable-line no-undef
            window.location.href = marker.url;
        });

        self.markers.push(marker);
    });
}
