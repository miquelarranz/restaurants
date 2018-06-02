'use strict';

const restaurantInfo = {
    restaurant: undefined,
    map: undefined,
    mapLoaded: false,
};

document.getElementById('map-button').addEventListener('click', toggleMap);

function toggleMap() {
    const map = document.getElementById('map');
    map.style.display = (map.style.display === 'none') ? 'block' : 'none';

    if (!restaurantInfo.mapLoaded) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.defer = true;
        script.src= 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBkrOcJWww1bYgBkZmI2UqdoKHwRGiLIlQ&libraries=places&callback=initMap';
        document.body.appendChild(script);
        map.classList.add('loaded');

        restaurantInfo.mapLoaded = true;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.async = true;
    link.href= '/dist/css/restaurant.css';
    document.head.appendChild(link);

    initializeView();
});

function initializeView() {
    IndexDBHelper.openDatabase(); // eslint-disable-line no-undef

    echo.init({ // eslint-disable-line no-undef
        offset: 100,
        throttle: 250,
        unload: false
    });

    IndexDBHelper.showCachedRestaurants().then((restaurants) => { // eslint-disable-line no-undef
        const restaurant = restaurants.filter((restaurant) => {
            return restaurant.id === getParameterByName('id');
        })[0];

        console.log('cached', restaurant)

        if (restaurant) {
            restaurantInfo.restaurant = restaurant;
            fillRestaurantHTML();
        }

        fetchRestaurantFromURL((error, restaurant) => {
            if (error) { // Got an error!
                console.error(error);
            } else {
                fillBreadcrumb();
                DBHelper.mapMarkerForRestaurant(restaurantInfo.restaurant, restaurantInfo.map); // eslint-disable-line no-undef
            }
        });
    });
}

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
    restaurantInfo.map = new google.maps.Map(document.getElementById('map'), { // eslint-disable-line no-undef
        zoom: 16,
        scrollwheel: false,
        center: restaurantInfo.restaurant.latlng
    });

    DBHelper.mapMarkerForRestaurant(restaurantInfo.restaurant, restaurantInfo.map); // eslint-disable-line no-undef
};

/**
 * Get current restaurant from page URL.
 */
function fetchRestaurantFromURL(callback) {
    if (restaurantInfo.restaurant) { // restaurant already fetched!
        callback(null, restaurantInfo.restaurant);
        return;
    }
    const id = getParameterByName('id');
    if (!id) { // no id found in URL
        let error = 'No restaurant id in URL';
        callback(error, null);
    } else {
        DBHelper.fetchRestaurantById(id, (error, restaurant) => { // eslint-disable-line no-undef
            if (!restaurant) {
                return;
            }
            restaurantInfo.restaurant = restaurant;

            fillRestaurantHTML();
            callback(null, restaurant);
        });
    }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
function fillRestaurantHTML(restaurant) {
    if (!restaurant) {
        restaurant = restaurantInfo.restaurant;
    }

    const name = document.getElementById('restaurant-name');
    name.innerHTML = restaurant.name;

    const address = document.getElementById('restaurant-address');
    address.innerHTML = restaurant.address;

    const image = document.getElementById('restaurant-img');
    image.className = 'restaurant-img';
    image.defer = true;
    image.alt = restaurant.name;
    image.setAttribute('src', './img/grey.webp'); // eslint-disable-line no-undef
    image.setAttribute('data-echo', DBHelper.imageUrlForRestaurant(restaurant)); // eslint-disable-line no-undef

    const cuisine = document.getElementById('restaurant-cuisine');
    cuisine.innerHTML = restaurant.cuisine_type;

    // fill operating hours
    if (restaurant.operating_hours) {
        fillRestaurantHoursHTML();
    }
    // fill reviews
    fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
function fillRestaurantHoursHTML(operatingHours) {
    if (!operatingHours) {
        operatingHours = restaurantInfo.restaurant.operating_hours;
    }

    const hours = document.getElementById('restaurant-hours');
    for (let key in operatingHours) {
        const row = document.createElement('tr');

        const day = document.createElement('td');
        day.innerHTML = key;
        row.appendChild(day);

        const time = document.createElement('td');
        time.innerHTML = operatingHours[key];
        row.appendChild(time);

        hours.appendChild(row);
    }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
function fillReviewsHTML(reviews) {
    if (!reviews) {
        reviews = restaurantInfo.restaurant.reviews;
    }

    const container = document.getElementById('reviews-container');
    const title = document.createElement('h2');
    title.innerHTML = 'Reviews';
    container.appendChild(title);

    if (!reviews) {
        const noReviews = document.createElement('p');
        noReviews.innerHTML = 'No reviews yet!';
        container.appendChild(noReviews);
        return;
    }
    const ul = document.getElementById('reviews-list');
    reviews.forEach(review => {
        ul.appendChild(createReviewHTML(review));
    });
    container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
function createReviewHTML(review) {
    const li = document.createElement('li');
    const name = document.createElement('p');
    name.innerHTML = review.name;
    li.appendChild(name);

    const date = document.createElement('p');
    date.innerHTML = review.date;
    li.appendChild(date);

    const rating = document.createElement('p');
    rating.innerHTML = `Rating: ${review.rating}`;
    li.appendChild(rating);

    const comments = document.createElement('p');
    comments.innerHTML = review.comments;
    li.appendChild(comments);

    return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
function fillBreadcrumb(restaurant) {
    if (!restaurant) {
        restaurant = restaurantInfo.restaurant;
    }

    const breadcrumb = document.getElementById('breadcrumb');
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `restaurant.html?id=${restaurant.id}`;
    a.setAttribute('aria-current', 'page');
    a.innerHTML = restaurant.name;
    li.appendChild(a);
    breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
function getParameterByName(name, url) {
    if (!url)
        url = window.location.href;
    name = name.replace(/[[]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
        results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
