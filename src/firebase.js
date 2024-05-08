import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyAC4ea2mQuTC8deEl70neflfjhCod1yaWQ",
    authDomain: "gswing-3775f.firebaseapp.com",
    projectId: "gswing-3775f",
    storageBucket: "gswing-3775f.appspot.com",
    messagingSenderId: "732253209056",
    appId: "1:732253209056:web:19c92fbb1f60b7424e6b85",
    measurementId: "G-RYDLSMV8RR"
  }; 

const app =initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// export const requestForToken=()=>{
//     return getToken(messaging, {vapidKey:"BLXmWF-ER7nTSwFays14bYD5CEYzp8AO8u33qsl30AcIHdyK8WZzMLk4RzEmzWqW55u524c2tZeFMvULjxEdtow"})
//     .then((currentToken)=>{
//         if (currentToken) {
//             console.log('Token client', currentToken);
//         } else {
//             console.log('No ergistration token available');
//         }
//     }).catch((err)=>console.log('error while register token', err));
// }

// export const onMessageListener=()=>{
//     return new Promise((resolve)=>{
//         onMessage(messaging, (payload)=>{
//             console.log('OnMessage Payload', payload);

//             resolve(payload);
//         })
//     })
// }

export const requestPermission =()=>{
    console.log("Requesting permission...");
    Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
            console.log("Notification user permission granted.");

            return getToken(messaging, {
                vapidKey: "BLXmWF-ER7nTSwFays14bYD5CEYzp8AO8u33qsl30AcIHdyK8WZzMLk4RzEmzWqW55u524c2tZeFMvULjxEdtow"
            })
            .then((currentToken)=>{
                if (currentToken) {
                    console.log('Client Token: ', currentToken);
                } else {
                    console.log('Failed to generate the app registration token.');
                }
            })
            .catch((err)=>{
                console.log('An error occurred when requesting to receive the token.', err);
            });
            
        } else {
            console.log('User Permission Denied.');
        }
    });
}

requestPermission();

export const onMessageListener = ()=> new Promise(resolve=>{
    onMessage(messaging, payload => {
        resolve(payload);
    });
});