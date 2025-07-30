// public/firebase-messaging-sw.js

/* eslint-env serviceworker */
/* global importScripts, self, firebase */

importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyBp5k-WVnCbfuq5sRwdEC5h8Ap4lConc0E",
  authDomain: "nagpurproperty-fdd80.firebaseapp.com",
  projectId: "nagpurproperty-fdd80",
  storageBucket: "nagpurproperty-fdd80.firebasestorage.app",
  messagingSenderId: "238421181794",
  appId: "1:238421181794:web:832723f4399a923822583b",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png", // optional icon path
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
