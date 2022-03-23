// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
// importScripts("/__/firebase/9.2.0/firebase-app-compat.js");
// importScripts("/__/firebase/9.2.0/firebase-messaging-compat.js");
// importScripts("/__/firebase/init.js");
// const messaging = firebase.messaging();

/**
 * Here is is the code snippet to initialize Firebase Messaging in the Service
 * Worker when your app is not hosted on Firebase Hosting.
 // Give the service worker access to Firebase Messaging.
 // Note that you can only use Firebase Messaging here. Other Firebase libraries
 // are not available in the service worker.

  // Retrieve an instance of Firebase Messaging so that it can handle background
  // messages.
const messaging = firebase.messaging();
**/

importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js"
);
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js";
import {
  getMessaging,
  onMessage,
  getToken,
} from "https://www.gstatic.com/firebasejs/9.6.9/firebase-messaging.js";
import { onBackgroundMessage } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-messaging-sw.js";
// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
initializeApp({
  apiKey: "AIzaSyAUG9tmNuWCmQ7t9SalXvQVyLxtKXNiljw",
  authDomain: "web-push-widget.firebaseapp.com",
  projectId: "web-push-widget",
  storageBucket: "web-push-widget.appspot.com",
  messagingSenderId: "402391781756",
  appId: "1:402391781756:web:6ed2b8306ead72f2acd4f9",
  measurementId: "G-D30XQYD92F",
});

// Retrieve Firebase Messaging object.
const messaging = getMessaging();

onBackgroundMessage(messaging, (payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
    self
  );
  // Customize notification here
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
