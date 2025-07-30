// // src/firebase.js

// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";
// import { useEffect } from "react";
// import { toast } from "react-toastify";
// const firebaseConfig = {
//   apiKey: "AIzaSyBp5k-WVnCbfuq5sRwdEC5h8Ap4lConc0E",
//   authDomain: "nagpurproperty-fdd80.firebaseapp.com",
//   projectId: "nagpurproperty-fdd80",
//   storageBucket: "nagpurproperty-fdd80.firebasestorage.app",
//   messagingSenderId: "238421181794",
//   appId: "1:238421181794:web:832723f4399a923822583b",
// };

// const firebaseApp = initializeApp(firebaseConfig);
// const messaging = getMessaging(firebaseApp);

// let serviceWorkerRegistration;

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .register("/firebase-messaging-sw.js")
//     .then((registration) => {
//       console.log("Service Worker registered with scope:", registration.scope);
//       serviceWorkerRegistration = registration;
//     })
//     .catch((error) => {
//       console.error("Service Worker registration failed:", error);
//     });
// }

// export const requestNotificationPermission = async () => {
//   try {
//     const permission = await Notification.requestPermission();
//     console.log("Notification permission:", permission);
//     return permission;
//   } catch (error) {
//     console.error("Error requesting notification permission:", error);
//     return null;
//   }
// };

// export const getFcmToken = async () => {
//   try {
//     if (!serviceWorkerRegistration) {
//       console.log("Waiting for service worker registration...");
//       await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait briefly
//       if (!serviceWorkerRegistration) {
//         throw new Error("Service Worker not registered");
//       }
//     }

//     const permission = await requestNotificationPermission();
//     if (permission !== "granted") {
//       console.log("Notification permission not granted");
//       return null;
//     }

//     const token = await getToken(messaging, {
//       vapidKey:
//         "BCM4DPxu1cA-72uSYgcJUOptnF7IWSip24fWJmDkToDvkF6KVlDyGDUW1Buhm-5cmTmWM3pYRaDVoITsi-ma1Ps",
//       serviceWorkerRegistration,
//     });

//     if (token) {
//       console.log("FCM Token:", token);
//       return token;
//     } else {
//       console.log("No FCM token available. Permission may not be granted.");
//       return null;
//     }
//   } catch (error) {
//     console.error("Error getting FCM token:", error);
//     return null;
//   }
// };

// export const setupForegroundMessaging = () => {
//   onMessage(messaging, (payload) => {
//     console.log("Foreground message received:", payload);
//     const notificationTitle =
//       payload.notification?.title || "Foreground Notification";
//     const notificationOptions = {
//       body: payload.notification?.body || "Default body",
//       icon: "/firebase-logo.png",
//     };

//     if (Notification.permission === "granted") {
//       new Notification(notificationTitle, notificationOptions);
//     }
//   });
// };

import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { toast } from "react-toastify";
import { useEffect } from "react";
const firebaseConfig = {
  apiKey: "AIzaSyBp5k-WVnCbfuq5sRwdEC5h8Ap4lConc0E",
  authDomain: "nagpurproperty-fdd80.firebaseapp.com",
  projectId: "nagpurproperty-fdd80",
  storageBucket: "nagpurproperty-fdd80.firebasestorage.app",
  messagingSenderId: "238421181794",
  appId: "1:238421181794:web:832723f4399a923822583b",
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

let serviceWorkerRegistration;

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
      serviceWorkerRegistration = registration;
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    console.log("Notification permission:", permission);
    return permission;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return null;
  }
};

export const getFcmToken = async () => {
  try {
    if (!serviceWorkerRegistration) {
      console.log("Waiting for service worker registration...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (!serviceWorkerRegistration) {
        throw new Error("Service Worker not registered");
      }
    }

    const permission = await requestNotificationPermission();
    if (permission !== "granted") {
      console.log("Notification permission not granted");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey:
        "BCM4DPxu1cA-72uSYgcJUOptnF7IWSip24fWJmDkToDvkF6KVlDyGDUW1Buhm-5cmTmWM3pYRaDVoITsi-ma1Ps",
      serviceWorkerRegistration,
    });

    if (token) {
      console.log("FCM Token:", token);
      return token;
    } else {
      console.log("No FCM token available. Permission may not be granted.");
      return null;
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

export const setupForegroundMessaging = () => {
  onMessage(messaging, (payload) => {
    console.log(
      "Foreground message received:",
      JSON.stringify(payload, null, 2)
    );
    console.log("Current Notification permission:", Notification.permission);

    const notificationTitle =
      payload.notification?.title ||
      payload.data?.title ||
      "Foreground Notification";
    const notificationOptions = {
      body: payload.notification?.body || payload.data?.body || "Default body",
      icon: "/firebase-logo.png",
    };

    if (Notification.permission === "granted") {
      try {
        new Notification(notificationTitle, notificationOptions);
      } catch (error) {
        console.error("Failed to show notification:", error);
        toast.info(`${notificationTitle}: ${notificationOptions.body}`, {
          position: "top-right",
        });
      }
    } else {
      console.log(
        "Notification permission not granted, requesting permission..."
      );
      requestNotificationPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(notificationTitle, notificationOptions);
        } else {
          console.log("Permission denied, using toast instead.");
          toast.info(`${notificationTitle}: ${notificationOptions.body}`, {
            position: "top-right",
          });
        }
      });
    }
  });
};

// For React components
export const useForegroundMessaging = () => {
  useEffect(() => {
    if (serviceWorkerRegistration) {
      setupForegroundMessaging();
    } else {
      console.log("Waiting for service worker before setting up messaging...");
      const interval = setInterval(() => {
        if (serviceWorkerRegistration) {
          setupForegroundMessaging();
          clearInterval(interval);
        }
      }, 500);
    }
  }, []);
};
