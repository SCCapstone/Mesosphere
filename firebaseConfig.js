import { initializeApp } from 'firebase/app'
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, deleteDoc, increment } from 'firebase/firestore/lite'
import { Post } from './Post'
import { User } from './User'

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

const IDSRef = doc(database, 'main', 'IDS')

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
  await setDoc(doc(database, 'accounts', u.MiD), {
    "MID": u.MiD,
    "biography": u.biography,
    "displayname": u.username,
    "friends": u.myPeers,
    "posts": u.myPosts
  })
}

export async function pullAccountFromDatabase (mesosphereID) {
  const userRef = doc(database, 'accounts', mesosphereID)
  const docSnap = await getDoc(userRef)
  if (docSnap.exists()) {
    const data = docSnap.data()
    console.log("Document data:", docSnap.data())
    return new User("", "", data.displayname, data.biography, data.MID, data.posts, data.friends)
  }
  else {
    console.log("Error: Requested post does not exist.")
  }
}

export async function removeAccountFromDatabase (u) {
  await deleteDoc(doc(database, 'accounts', u.MiD))
  
  for (let i = 0; i < u.myPosts.length; i++) {
    await deleteDoc(doc(database, 'posts', u.myPosts[i].postID))
  }
}

export async function addPeerToDatabase (u, peerID) {
  await updateDoc(doc(database, 'accounts', u.MiD), {
    friends: arrayUnion(peerID)
  })
}

export async function removePeerFromDatabase (u, peerID) {
  await updateDoc(doc(database, 'accounts', u.MiD), {
    friends: arrayRemove(peerID)
  })
}

export async function pushPostToDatabase (p) {
  await setDoc(doc(database, 'posts', p.postID), {
    "MID": p.attachedMiD,
    "postID": p.postID,
    "score": p.score,
    "text": p.textContent,
    "timestamp": new Date()
  })

  await updateDoc(doc(database, 'accounts', p.attachedMiD), {
    posts: arrayUnion(p.postID)
  })
}

export async function alterPostScore (postID, change) { //increment/decrement in units of 0.5; upvote: change = 0.5, downvote: change = -0.5
  await updateDoc(doc(database, 'posts', postID), {
    score: increment(change)
  })
} //done in conjunction with local post score altering, see Post.js

export async function removePostFromDatabase (p) {
  await updateDoc(doc(database, 'accounts', p.attachedMiD), {
    posts: arrayRemove(p.postID)
  })

  await deleteDoc(doc(database, 'posts', p.postID))
}

export async function pullPostFromDataBase (postID) {
  const postRef = doc(database, 'posts', postID)
  const docSnap = await getDoc(postRef)
  if (docSnap.exists()) {
    const data = docSnap.data()
    console.log("Document data:", docSnap.data());
    return new Post(data.MID, data.postID, data.score, data.text, data.timestamp)
  }
  else {
    console.log("Error: Requested post does not exist.")
  }
}


export { database }
