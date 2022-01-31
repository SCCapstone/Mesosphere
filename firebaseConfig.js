import { initializeApp } from 'firebase/app'
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, arrayRemove, Timestamp } from 'firebase/firestore/lite'

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
const database = getFirestore(app)

/* Database will store:
  - Mesosphere IDs
  - Post IDs
  */
// collection 'main'
// document 'IDS'

const IDSRef = doc(database, 'main', 'IDS')
const ContentRef = doc(database, 'main', 'Content')


export async function returnMIDSDatabaseLength () {
  const IDSSnap = await getDoc(IDSRef)
  if (IDSSnap.exists()) {
    // console.log(IDSSnap.data().MesosphereIDs)
  }
  return IDSSnap.data().MesosphereIDs.length
}

export async function returnPostIDDatabaseLength () {
  const IDSSnap = await getDoc(IDSRef)
  if (IDSSnap.exists()) {
    // console.log(IDSSnap.data().postIDs)
  }
  return IDSSnap.data().postIDs.length
}

export async function pushMIDToDatabase (MID) { // functional
  await updateDoc(IDSRef, {
    MesosphereIDs: arrayUnion(MID)
  })
}

export async function pushPostIDToDatabase (postID) { // functional
  await updateDoc(IDSRef, {
    postIDs: arrayUnion(postID)
  })
}


export async function pushAccountToDatabase (u) {
  await updateDoc(ContentRef, {
    accounts: arrayUnion({
      "MID": u.MiD,
      "biography": u.biography,
      "displayname": u.username,
      "friends": u.myPeers,
      "posts": u.myPosts
    })
  })
}

export async function removeAccountFromDatabase (MID) {

}

export async function addPeerToDatabase (MID, peerID) {

}

export async function removePeerFromDatabase (MID, peerID) {

}

export async function pushPostToDatabase (p) {
  await updateDoc(ContentRef, {
    posts: arrayUnion({
      "MID": p.MiD,
      "postID": p.postID,
      "score": p.score,
      "text": p.textContent,
      "timestamp": new Date()
    })
  })
}

export async function removePostFromDatabase (postID) {

}


export { database }
