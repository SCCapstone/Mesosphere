import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
// import { getDatabase, ref, set, onValue } from 'firebase/database';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, get, query, where, updateDoc, arrayUnion } from 'firebase/firestore/lite'
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
// collection 'main'
// document 'IDS'
// two fields in 'IDS' named "MIDS" and "postIDs"

const IDSRef = doc(database, 'main', 'IDS')

export async function returnMIDSDatabaseLength() {
  const IDSSnap = await getDoc(IDSRef)

  const MIDS = []
  if (IDSSnap.exists()) {
    console.log(IDSSnap.data().MIDS)
  }
  return IDSSnap.data().MIDS.length
}

export async function returnPostIDDatabaseLength() {
  const IDSSnap = await getDoc(IDSRef)

  const MIDS = []
  if (IDSSnap.exists()) {
    console.log(IDSSnap.data().MIDS)
  }
  return IDSSnap.data().MIDS.length
}


export async function pushMIDToDatabase (MID) { // functional
  await updateDoc(IDSRef, {
    MIDS: arrayUnion(MID)
  })
}

export async function pushPostIDToDatabase (postID) { // functional
  await updateDoc(IDSRef, {
    postIDs: arrayUnion(postID)
  })
}

export { database }
