import firebase from 'firebase'
import 'firebase/storage'
import 'firebase/firestore'

const firebaseConfig = {
    // Your firebase config
};

const firebaseApp = firebase.initializeApp(firebaseConfig);


export default  firebaseApp ;
