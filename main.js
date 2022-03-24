// Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-analytics.js";

// import {
//   getMessaging,
//   onMessage,
//   getToken,
// } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-messaging.js";

import { initializeApp } from "firebase/app";
import { getMessaging, onMessage, getToken } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const alfaFirebaseConfig = {
//   apiKey: "AIzaSyAUG9tmNuWCmQ7t9SalXvQVyLxtKXNiljw",
//   authDomain: "web-push-widget.firebaseapp.com",
//   projectId: "web-push-widget",
//   storageBucket: "web-push-widget.appspot.com",
//   messagingSenderId: "402391781756",
//   appId: "1:402391781756:web:6ed2b8306ead72f2acd4f9",
//   measurementId: "G-D30XQYD92F",
// };
let messaging; //= getMessaging();

function init(config, vapid) {
  initializeApp(config);
  messaging = getMessaging();
  handling(vapid);
}
window.init = init;
// Initialize Firebase
// const app = initializeApp(alfaFirebaseConfig);

// Retrieve Firebase Messaging object.

// Retrieve Firebase Messaging object.
// const messaging = firebase.messaging();

// IDs of divs that display registration token UI or request permission UI.
const tokenDivId = "token_div";
const permissionDivId = "permission_div";

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker
//   `messaging.onBackgroundMessage` handler.
function handling(vapidKey) {
  onMessage(messaging, (payload) => {
    console.log("Message received. ", payload);
    //pushMessageReceived
    // Update the UI to include the received message.
    appendMessage(payload);
  });

  function resetUI() {
    clearMessages();
    showToken("loading...");
    // Get registration token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    getToken(messaging, { vapidKey })
      .then((currentToken) => {
        if (currentToken) {
          sendTokenToServer(currentToken);
          updateUIForPushEnabled(currentToken);
          console.log("TOKEN=", currentToken);
          fetch(
            "https://pushservertest.edna.ru/push-test/service/device/registerPushDevice",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body:
                "{" +
                '	"pushDeviceInfo": {' +
                '		"appPackage": "web.push.widget",' +
                '		"appVersion": "1.1.0 (1)",' +
                '		"providerUid": "PH5HQGI1OUUtNjU4L3BEIz9CNFovfj4=",' +
                '		"pnsPushAddresses": [{' +
                '			"pns": "gcm",' +
                '			"pnsPushAddress": "' +
                currentToken +
                '"' +
                "		}]," +
                '		"deviceUid": "' +
                Math.floor(Math.random() * 100000) +
                '028cdbf63c0d55e83a19ac58ebf5c0c3f04",' +
                '		"installationUid": "dMRawr3ZSXWjwyAo' +
                Math.floor(Math.random() * 100) +
                'o3Am",' +
                '		"platform": 1,' +
                '		"osName": "ANDROID",' +
                '		"osVersionMajor": 13,' +
                '		"osVersionMinor": -1,' +
                '		"osVersionPatch": -1,' +
                '		"locale": "ru_RU",' +
                '		"timeZoneUTCOffsetSecond": 10800,' +
                '		"deviceSerialNumber": "unknown",' +
                '		"deviceModel": "site",' +
                '		"deviceName": "test",' +
                '		"version": "0.0.1",' +
                '		"ipAddress": "fe80::30df:79ff:fe03:d11d%dummy0",' +
                '		"macAddress": "32:DF:79:03:D1:1D",' +
                '		"routerIpAddress": "192.168.1.56",' +
                '		"routerMacAddress": "02:00:00:00:00:00",' +
                '		"memorySize": "32656",' +
                '		"apiLevel": 28,' +
                '		"canShowPushNotification": true,' +
                '		"notificationAlertAllowed": true' +
                "	}" +
                "              }",
            }
          )
            .then((response) => {
              return response.json();
            })
            .then((json) => {
              console.log("Response", json);
            });
        } else {
          // Show permission request.
          console.log(
            "No registration token available. Request permission to generate one."
          );
          // Show permission UI.
          updateUIForPushPermissionRequired();
          setTokenSentToServer(false);
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
        // requestPermission();
        showToken("Error retrieving registration token. ", err);
        setTokenSentToServer(false);
        updateUIForPushEnabled(currentToken);
      });

    // messaging
    //   .getToken({
    //     vapidKey:
    //       "BAjUZvYdDmcYszKcuFEoAKrgwVrc8xkaOqTPNC2n7bRl883iTRrjKuaQPc9yPhTEahbMSaJOWkgHYVEdCGUq2g8",
    //   })
    //   .then((currentToken) => {
    //     if (currentToken) {
    //       sendTokenToServer(currentToken);
    //       updateUIForPushEnabled(currentToken);
    //       console.log("test", currentToken);
    //     } else {
    //       // Show permission request.
    //       console.log(
    //         "No registration token available. Request permission to generate one."
    //       );
    //       // Show permission UI.
    //       updateUIForPushPermissionRequired();
    //       setTokenSentToServer(false);
    //     }
    //   })
    //   .catch((err) => {
    //     console.log("An error occurred while retrieving token. ", err);
    //  // requestPermission();
    //     showToken("Error retrieving registration token. ", err);
    //     setTokenSentToServer(false);
    //     // updateUIForPushEnabled(currentToken);
    //   });
  }

  function showToken(currentToken) {
    // Show token in console and UI.
    const tokenElement = document.querySelector("#token");
    tokenElement.textContent = currentToken;
  }

  // Send the registration token your application server, so that it can:
  // - send messages back to this app
  // - subscribe/unsubscribe the token from topics
  function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer()) {
      console.log("Sending token to server...");
      // TODO(developer): Send the current token to your server.
      setTokenSentToServer(true);
    } else {
      console.log(
        "Token already sent to server so won't send it again " +
          "unless it changes"
      );
    }
  }

  function isTokenSentToServer() {
    return window.localStorage.getItem("sentToServer") === "1";
  }

  function setTokenSentToServer(sent) {
    window.localStorage.setItem("sentToServer", sent ? "1" : "0");
  }

  function showHideDiv(divId, show) {
    const div = document.querySelector("#" + divId);
    if (show) {
      div.style = "display: visible";
    } else {
      div.style = "display: none";
    }
  }

  function requestPermission() {
    console.log("Requesting permission...");
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted.");
        // TODO(developer): Retrieve a registration token for use with FCM.
        // In many cases once an app has been granted notification permission,
        // it should update its UI reflecting this.
        resetUI();
      } else {
        console.log("Unable to get permission to notify.");
        //TODO: request permission again
      }
    });
  }

  // function deleteToken() {
  //   // Delete registration token.
  //   getToken(messaging, {
  //       vapidKey:
  //         "BNDR5UyU4EPY52TkGtTU0gVSSpHnPMv819cKIOrLw5_WwUNfhH1c7zo_TID_WZawFxytDNQNKtXUvEl91ZYiK-c",
  //     })
  //     .then((currentToken) => {
  //       messaging
  //         .deleteToken(currentToken)
  //         .then(() => {
  //           console.log("Token deleted.");
  //           setTokenSentToServer(false);
  //           // Once token is deleted update UI.
  //           resetUI();
  //         })
  //         .catch((err) => {
  //           console.log("Unable to delete token. ", err);
  //         });
  //     })
  //     .catch((err) => {
  //       console.log("Error retrieving registration token. ", err);
  //       showToken("Error retrieving registration token. ", err);
  //     });
  // }

  // Add a message to the messages element.
  function appendMessage(payload) {
    const messagesElement = document.querySelector("#messages");
    const dataHeaderElement = document.createElement("h5");
    const dataElement = document.createElement("pre");

    dataElement.style = "overflow-x:hidden;";
    dataHeaderElement.textContent = "Received message:";
    dataElement.textContent = JSON.stringify(payload, null, 2);
    messagesElement.appendChild(dataHeaderElement);
    messagesElement.appendChild(dataElement);
  }

  // Clear the messages element of all children.
  function clearMessages() {
    const messagesElement = document.querySelector("#messages");
    while (messagesElement.hasChildNodes()) {
      messagesElement.removeChild(messagesElement.lastChild);
    }
  }

  function updateUIForPushEnabled(currentToken) {
    showHideDiv(tokenDivId, true);
    showHideDiv(permissionDivId, false);
    showToken(currentToken);
  }

  function updateUIForPushPermissionRequired() {
    showHideDiv(tokenDivId, false);
    showHideDiv(permissionDivId, true);
  }

  resetUI();
}
