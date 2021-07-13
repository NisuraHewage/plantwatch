importScripts("https://www.gstatic.com/firebasejs/4.12.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.12.0/firebase-messaging.js");
const config = {
    apiKey: "AIzaSyC-ZtO_OPhu5Dq8_lZrzCZ6t01X-8Kj4Fg",
   projectId: "escapade-69098",
   messagingSenderId: "406824911363",
   appId: '11:406824911363:web:93fe21fb18b399cbb20436'
}
firebase.initializeApp(config);


const messaging = firebase.messaging();
  messaging.setBackgroundMessageHandler(payload => {
   const title = payload.notification.title;
   console.log('payload', payload.notification.icon);
   const options = {
      body: payload.notification.body,
      icon: payload.notification.icon
   }
   return self.registration.showNotification(title, options);
})

self.addEventListener("notificationclick", function(event) {
    const clickedNotification = event.notification;
    clickedNotification.close();
    const promiseChain = clients
        .matchAll({
            type: "window",
            includeUncontrolled: true
         })
        .then(windowClients => {
            let matchingClient = null;
            for (let i = 0; i < windowClients.length; i++) {
                const windowClient = windowClients[i];
                if (windowClient.url === feClickAction) {
                    matchingClient = windowClient;
                    break;
                }
            }
            if (matchingClient) {
                return matchingClient.focus();
            } else {
                return clients.openWindow(feClickAction);
            }
        });
        event.waitUntil(promiseChain);
 });