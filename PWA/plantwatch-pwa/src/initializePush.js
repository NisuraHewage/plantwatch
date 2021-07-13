import firebase from "firebase";

import { config, vapidKey } from "../src/firebaseConfig";

export function initializePush() {

    // if token is already available, then do not get a new one
    if(localStorage.getItem('deviceToken') != null)
        return;

   const messaging = firebase.messaging();
   messaging
      .requestPermission()
      .then(() => {

         console.log("Have Permission");
         return messaging.getToken({ vapidKey: vapidKey });
       })
      .then(token => {
         console.log("FCM Token:", token);
         localStorage.setItem('deviceToken', token);
         // check if FCM token in storage if it is not 


         //you probably want to send your new found FCM token to the
         //application server so that they can send any push
         //notification to you.
       })
      .catch(error => {
         if (error.code === "messaging/permission-blocked") {
            console.log("Please Unblock Notification Request   Manually");
         } else {
            console.log("Error Occurred", error);
         }
        });

        messaging.onMessage(payload => {
            console.log("Notification Received", payload);
            //this is the function that gets triggered when you receive a 
            //push notification while you’re on the page. So you can 
            //create a corresponding UI for you to have the push 
            //notification handled.
         });
    }