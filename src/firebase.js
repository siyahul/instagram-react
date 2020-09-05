import firebase from 'firebase';

const firebaseApp= firebase.initializeApp({
    apiKey: "AIzaSyAJqfhGMk9V_8ypfW-npcnUXklTfE-oGcs",
    authDomain: "instagram-haq.firebaseapp.com",
    databaseURL: "https://instagram-haq.firebaseio.com",
    projectId: "instagram-haq",
    storageBucket: "instagram-haq.appspot.com",
    messagingSenderId: "47257195517",
    appId: "1:47257195517:web:46689d20b49c3ee5cdff94",
    measurementId: "G-KRVHZ49BSS"
});
    const db = firebaseApp.firestore();
    const auth = firebase.auth();
    const storage = firebase.storage();
    export {db, auth, storage}
  //export default db;