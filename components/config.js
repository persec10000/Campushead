import * as fb from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/app';
import { Platform } from 'react-native';
import firebase from 'react-native-firebase';

// import firebase from 'firebase';
import '@firebase/messaging';
// Initialize Firebase
var FireBaseApp = firebase;

const firebaseConfig = {
    apiKey: "AIzaSyBJh34CG_nFO4uLMN_3EP6WSWfNtcS79UM",
    authDomain: "campushead-app.firebaseapp.com",
    databaseURL: "https://campushead-app.firebaseio.com",
    projectId: "campushead-app",
    storageBucket: "campushead-app.appspot.com",
    messagingSenderId: "410955858616",
    appId: "1:410955858616:ios:9b9a7fcf31016a38fdea4d"
};

// Initialize Firebase
let app = fb.initializeApp(firebaseConfig);
if (Platform.OS === "ios") FireBaseApp = app;
export default FireBaseApp;