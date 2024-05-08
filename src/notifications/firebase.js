import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import axios from "axios";
import { baseUrl } from "../config";

const firebaseConfig = {
  apiKey: "AIzaSyAC4ea2mQuTC8deEl70neflfjhCod1yaWQ",
  authDomain: "gswing-3775f.firebaseapp.com",
  projectId: "gswing-3775f",
  storageBucket: "gswing-3775f.appspot.com",
  messagingSenderId: "732253209056",
  appId: "1:732253209056:web:19c92fbb1f60b7424e6b85",
  measurementId: "G-RYDLSMV8RR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generateToken = async () => {
  const permission = await Notification.requestPermission();
  console.log(permission);
  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey:
        "BLXmWF-ER7nTSwFays14bYD5CEYzp8AO8u33qsl30AcIHdyK8WZzMLk4RzEmzWqW55u524c2tZeFMvULjxEdtow",
    });
    console.log(token);
    await simpanTokenFcm(token);
  }
};

///simpan token ke database
const simpanTokenFcm = async (token) => {
  let data = {
    id: token,
  };
  await axios
    .post(baseUrl + "/tokenfcm", data)
    .then((res) => {
      // console.log(res.data.message);
    })
    .catch((err) => console.log(err));
};
