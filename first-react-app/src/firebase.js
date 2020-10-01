import firebase from 'firebase'
import 'firebase/storage'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBJoq3IMkJIs1Lh_McAOWtfjQMHjl1B6MU",
    authDomain: "instagram-1ae56.firebaseapp.com",
    databaseURL: "https://instagram-1ae56.firebaseio.com",
    projectId: "instagram-1ae56",
    storageBucket: "instagram-1ae56.appspot.com",
    messagingSenderId: "403754603990",
    appId: "1:403754603990:web:e0303250f1cabd70950077"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);


export default  firebaseApp ;