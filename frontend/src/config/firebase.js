import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
// 	apiKey: "AIzaSyBmeeXkJqsxSwG_9Hq5424Y--XQDcG21A0",
// 	authDomain: "kvantas-live.firebaseapp.com",
// 	databaseURL:
// 		"https://kvantas-live-default-rtdb.asia-southeast1.firebasedatabase.app",
// 	projectId: "kvantas-live",
// 	storageBucket: "kvantas-live.appspot.com",
// 	messagingSenderId: "1017995256596",
// 	appId: "1:1017995256596:web:0cc799422a40f4eb975801",
// 	measurementId: "G-Z836XD4WSY",
// };

// const firebaseConfig = {
// 	apiKey: "AIzaSyAqfakAkya8Csj1plSuSd0l_wUlsOWPDx0",
// 	authDomain: "kvants-f7d03.firebaseapp.com",
// 	projectId: "kvants-f7d03",
// 	storageBucket: "kvants-f7d03.appspot.com",
// 	messagingSenderId: "467316662972",
// 	appId: "1:467316662972:web:0cd486d3124097a23066b9",
// 	measurementId: "G-21B3VVXQVR",
// };

const firebaseConfig = {
	apiKey: "AIzaSyA6ff_Kb1fm5fAa_e6U7L3k-ElWfl63qTo",
	authDomain: "kvants-1.firebaseapp.com",
	projectId: "kvants-1",
	storageBucket: "kvants-1.appspot.com",
	messagingSenderId: "231930077156",
	appId: "1:231930077156:web:3a2f4626a5b355495871f1",
	measurementId: "G-CJEGFGSTJZ",
};

// const firebaseConfig = {
// 	apiKey: "AIzaSyDjuTev5t2zsIPZbXvaVF1Q7wwwYAeVPCM",
// 	authDomain: "kvants-2.firebaseapp.com",
// 	projectId: "kvants-2",
// 	storageBucket: "kvants-2.appspot.com",
// 	messagingSenderId: "1002638991536",
// 	appId: "1:1002638991536:web:4345c6018c93017f5ddb75",
// 	measurementId: "G-NSHR3YPHGZ",
// };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log(db, app);

export { db };
