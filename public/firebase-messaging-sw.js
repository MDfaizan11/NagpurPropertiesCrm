/* eslint-env serviceworker */
/* eslint-disable no-restricted-globals */
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAxHSXDA6MHsVqz00pHjpo-FlkmorUcK1w",
  authDomain: "nagpur-properties.firebaseapp.com",
  projectId: "nagpur-properties",
  storageBucket: "nagpur-properties.firebasestorage.app",
  messagingSenderId: "643806571074",
  appId: "1:643806571074:web:483d53f8afe13da3325bdb"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    JSON.stringify(payload, null, 2)
  );

  if (!payload || (!payload.notification && !payload.data)) {
    console.warn("Invalid or empty payload, skipping notification.");
    return;
  }

  const notificationTitle =
    payload.notification?.title ||
    payload.data?.title ||
    "Default Notification";
  const notificationOptions = {
    body:
      payload.notification?.body ||
      payload.data?.body ||
      "You have a new message.",
    icon: "/icon.png",
  };

  if (
    !self.registration ||
    typeof self.registration.showNotification !== "function"
  ) {
    console.error(
      "showNotification is not supported or registration is invalid."
    );
    return;
  }

  if (self.Notification.permission !== "granted") {
    console.warn(
      "Notification permission not granted:",
      self.Notification.permission
    );
    return;
  }

  try {
    const notificationPromise = self.registration.showNotification(
      notificationTitle,
      notificationOptions
    );
    if (notificationPromise && typeof notificationPromise.then === "function") {
      notificationPromise
        .then(() => {
          console.log("Background notification displayed successfully");
        })
        .catch((error) => {
          console.error("Failed to display background notification:", error);
        });
    } else {
      console.log("Notification triggered (non-Promise result)");
    }
  } catch (error) {
    console.error("Error in showNotification:", error);
  }
});
