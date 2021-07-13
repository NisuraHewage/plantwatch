self.addEventListener('install', event => {
  console.log('V1 installing…');

});

self.addEventListener('activate', event => {
  console.log('V1 now ready to handle fetches!');
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

 /*  event.waitUntil(
    self.registration.showNotification("Internet", {
        body: "internet not working"
    })
  ) */
});