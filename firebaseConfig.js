import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
// import { getDatabase, ref, set, onValue } from 'firebase/database';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, get, query, where, updateDoc, arrayUnion} from 'firebase/firestore/lite'
import { transaction } from 'elementos'

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
const database = getFirestore(app)

/* Database will store:
  - Mesosphere IDs
  - Post IDs
  */
//collection 'main'
//document 'IDS'
//two fields in 'IDS' named "MIDS" and "postIDs"

const IDSRef = doc(database, "main", "IDS")

export async function returnDatabaseMIDS() {
  const IDSSnap = await getDoc(IDSRef)

  var MIDS = []
  if (IDSSnap.exists()) {
    console.log(IDSSnap.data().MIDS)
  } //returns data field to console correctly
}

// export async function returnTestData() {
//   const q = query(collection(database, "cities"), where("capital", "==", true));

//   const querySnapshot = await getDocs(q);
//   querySnapshot.forEach((doc) => {
//     // doc.data() is never undefined for query doc snapshots
//     console.log(doc.id, " => ", doc.data());
//   });
// }

export async function pushMIDToDatabase(MID) { //functional
  await updateDoc(IDSRef, {
    MIDS: arrayUnion(MID)
  })
}

export async function pushPostIDToDatabase(postID) { //functional
  await updateDoc(IDSRef, {
    postIDs: arrayUnion(postID)
  })
}

export { database }
