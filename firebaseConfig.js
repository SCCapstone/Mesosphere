import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
// import { getDatabase, ref, set, onValue } from 'firebase/database';
import { getFirestore, collection, doc, getDoc, getDocs } from 'firebase/firestore/lite'

const firebaseConfig = { // SUPER INSECURE, EXPOSED API KEYS FOR NON-DEV USE IS REALLY BAD
    apiKey: 'AIzaSyBVaQdvRQcffg60M_zZS9zuLBTgFbCFGWo',
    authDomain: 'apex-mesosphere.firebaseapp.com',
    projectId: 'apex-mesosphere',
    storageBucket: 'apex-mesosphere.appspot.com',
    messagingSenderId: '585675242764',
    appId: '1:585675242764:web:5593184374b2c2c192dd29',
    measurementId: 'G-XTQEV03BPS'
  }
  const app = initializeApp(firebaseConfig)
  const analytics = getAnalytics(app)
  const database = getFirestore(app);
  const IDRef = collection(database, 'main');

  /* Database will store:
  - Mesosphere IDs
  - Post IDs
  */

  export { database }