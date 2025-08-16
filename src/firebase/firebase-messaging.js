import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAxHSXDA6MHsVqz00pHjpo-FlkmorUcK1w",
  authDomain: "nagpur-properties.firebaseapp.com",
  projectId: "nagpur-properties",
  storageBucket: "nagpur-properties.firebasestorage.app",
  messagingSenderId: "643806571074",
  appId: "1:643806571074:web:483d53f8afe13da3325bdb",
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

let swRegistration;

export const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      swRegistration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );
      console.log("Service Worker Registered:", swRegistration);
      return swRegistration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      throw error;
    }
  } else {
    console.error("Service workers are not supported in this browser");
    return null;
  }
};

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    console.log("Notification Permission:", permission);
    if (permission === "denied") {
      console.warn(
        "Notifications are blocked. Please enable them in browser settings."
      );
    } else if (permission === "default") {
      console.warn(
        "Notification permission not granted yet. User needs to allow notifications."
      );
    }
    return permission;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return null;
  }
};

export const getFcmToken = async () => {
  if (!swRegistration) {
    console.warn("Service worker not registered yet, registering now...");
    await registerServiceWorker();
  }

  try {
    const token = await getToken(messaging, {
      vapidKey:
        "BF8mLEto4bEgrsmQRswIa_pF6QWuyJrUpt6bH8e5-qubByhCWhv7bcyaexsLNHk-x2ZpujcJvxQnF_AMzZBQg3A",
      serviceWorkerRegistration: swRegistration,
    });

    if (token) {
      console.log("FCM Token:", token);
      return token;
    } else {
      console.warn(
        "No registration token available. Request permission or check service worker."
      );
      return null;
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

export const setupForegroundMessaging = () => {
  console.log("Setting up foreground messaging...");
  try {
    onMessage(messaging, (payload) => {
      console.log(
        "Foreground message received:",
        JSON.stringify(payload, null, 2)
      );

      // Validate payload
      if (!payload || (!payload.notification && !payload.data)) {
        console.warn("Invalid or empty payload, skipping notification.");
        return;
      }

      const title =
        payload.notification?.title || payload.data?.title || "Notification";
      const options = {
        body:
          payload.notification?.body ||
          payload.data?.body ||
          "You have a new message.",
        icon: "/icon.png", // Ensure this path points to a valid icon in your public directory
      };

      // Check if Notification API is supported
      if (!("Notification" in window)) {
        console.error("Notification API not supported in this browser.");
        return;
      }

      // Check permission and display notification
      if (Notification.permission === "granted") {
        try {
          const notification = new Notification(title, options);
          console.log("Foreground notification displayed successfully");
          // Handle notification errors (e.g., invalid icon)
          notification.onerror = (error) => {
            console.error("Foreground notification error:", error);
          };
        } catch (error) {
          console.error("Failed to show foreground notification:", error);
        }
      } else {
        console.warn(
          "Notification permission not granted:",
          Notification.permission
        );
        // Optionally request permission again
        Notification.requestPermission().then((permission) => {
          console.log("Re-requested permission:", permission);
          if (permission === "granted") {
            try {
              const notification = new Notification(title, options);
              console.log(
                "Foreground notification displayed after permission grant"
              );
            } catch (error) {
              console.error(
                "Failed to show foreground notification after permission:",
                error
              );
            }
          }
        });
      }
    });
  } catch (error) {
    console.error("Error in onMessage handler:", error);
  }
};
