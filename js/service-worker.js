document.addEventListener('DOMContentLoaded', (event) => {
  registerServiceWorker();
});

registerServiceWorker = () => {
  if (!navigator.serviceWorker) return;

  navigator.serviceWorker.register('/sw.js').then((reg) => {
    console.log('Registration completed!')
  }).catch((error) => {
    console.log('Registration failed!')
  });
}
