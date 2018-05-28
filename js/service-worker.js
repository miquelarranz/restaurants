'use strict';

document.addEventListener('DOMContentLoaded', () => {
    registerServiceWorker();
});

function registerServiceWorker() {
    if (!navigator.serviceWorker) return;

    navigator.serviceWorker.register('/sw.js').then(() => {
        console.log('Registration completed!');
    }).catch((error) => {
        console.log('Registration failed! ->', error);
    });
}
