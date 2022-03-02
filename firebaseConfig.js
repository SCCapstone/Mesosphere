import { initializeApp } from 'firebase/app'
import { getFirestore, doc, collectionGroup, getDoc, getDocs, setDoc, updateDoc, arrayUnion, arrayRemove, deleteDoc, increment, DocumentSnapshot } from 'firebase/firestore/lite'
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

export async function returnMIDSDatabaseArray () {
  const userRef = collectionGroup(database, 'accounts')
  const docSnap = await getDocs(userRef)
  const activeIDs = []
  if(docSnap.size != 0) {
    //console.log(docSnap.docs)
    for(const document of docSnap.docs) {
      //console.log("Attempting to print MID:")
      //console.log(document.data().MID)
      activeIDs.push(document.data().MID)
    }
  } else {
    console.log("No active IDs!")
  }
  return activeIDs;
}

export async function returnPostIDDatabaseLength () {
  const IDSSnap = await getDoc(IDSRef)
  if (IDSSnap.exists()) {
    // console.log(IDSSnap.data().postIDs)
  }
  return IDSSnap.data().postIDs.length
}

export async function pushMIDToDatabase (MID) {
  await updateDoc(IDSRef, {
    MesosphereIDs: arrayUnion(MID)
  })
}

export async function pushPostIDToDatabase (postID) {
  await updateDoc(IDSRef, {
    postIDs: arrayUnion(postID)
  })
}

export async function pushAccountToDatabase (u) {
  await setDoc(doc(database, 'accounts', u.MiD), {
    MID: u.MiD,
    biography: u.biography,
    displayname: u.realName,
    friends: u.myPeers,
    posts: u.myPosts
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
    console.log("Error: Requested acc does not exist.")
    return null;
  }
}

export async function removeAccountFromDatabase (u) {
  await deleteDoc(doc(database, 'accounts', u.MiD))

  for (let i = 0; i < u.myPosts.length; i++) {
    await deleteDoc(doc(database, 'posts', u.myPosts[i].postID))
  }
}

export async function returnDisplayNameFromMID (MID) {
  const userRef = doc(database, 'accounts', mesosphereID)
  const docSnap = await getDoc(userRef)
  if (docSnap.exists()) {
    return docSnap.data().displayname
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
    MID: p.attachedMiD,
    postID: p.postID,
    score: p.starting_score,
    text: p.textContent,
    interactedUsers: p.interactedUsers,
    timestamp: p.timestamp
  })

  await updateDoc(doc(database, 'accounts', p.attachedMiD), {
    posts: arrayUnion(p.postID)
  })
}

export async function alterPostScore (u, postID, change) { // increment/decrement in units of 0.5; upvote: change = 0.5, downvote: change = -0.5
  const postRef = doc(database, 'posts', postID)
  await updateDoc(doc(database, 'posts', postID), {
    score: increment(change)
  })
  // Post component handles interaction
  //await addUserInteraction (u, postID, change)
}

export async function addUserInteraction (u, postID, change) {
  var actionTaken = ""
  if(change > 0) {
      actionTaken = 'like'
  } else {
      actionTaken = 'dislike'
  }

  await updateDoc(doc(database, 'posts', postID), { //updates interactedUsers in the post with the MID and action taken
    interactedUsers: arrayUnion(
      {
        user: u.MiD,
        action: actionTaken
      }
    )
  })
} //NOTE: arrayUnion ensures that an interaction either like/dislike can only appear once each time per user, however, the score can keep increasing if validation isn't ensured

export async function removeInteractions (u, postID) {
  while(await hasInteractedWith(u, postID)) {
    const actionTaken = await returnInteractionFromDatabase(u, postID)
    await updateDoc(doc(database, 'posts', postID), {
      interactedUsers: arrayRemove(
        {
          user: u.MiD,
          action: actionTaken
        }
      )
    })
  }
}

export async function returnInteractionFromDatabase (u, postID) {
  const postRef = doc(database, 'posts', postID)
  const postSnap = await getDoc(postRef)
  if (!postSnap.exists()) {
      console.log('Error: Requested post does not exist.')
  } else if (hasInteractedWith(u, postID) === false) {
    return null
  } else {
    try {
      return postSnap.data().interactedUsers.find(item => item.user === u.MiD).action
    } catch (error) {
      console.error(error)
    }
  }
}

export async function removePostFromDatabase (p) {
  await updateDoc(doc(database, 'accounts', p.attachedMiD), {
    posts: arrayRemove(p.postID)
  })

  await deleteDoc(doc(database, 'posts', p.postID))
}

export async function pullPostFromDatabase (postID) {
  const postRef = doc(database, 'posts', postID)
  const docSnap = await getDoc(postRef)
  if (docSnap.exists()) {
    const data = docSnap.data()
    console.log("Document data:", docSnap.data());
    console.log(data.timestamp);
    //const realstamp = new Date(1970, 0, 1);
    //realstamp.setSeconds(data.timestamp.seconds);
    //realstamp.setMilliseconds(data.timestamp.nanoseconds)
    //console.log("timestamp pulled down:" + realstamp);
    return new Post(data.MID, data.postID, null, data.text, data.score, data.interactedUsers, data.timestamp)
  }
  else {
    console.log("Error: Requested post does not exist.")
    return null;
  }
}

export async function getScoreFromPostInDatabase(postID){
  const postRef = doc(database, 'posts', postID)
  const docSnap = await getDoc(postRef)
  if (docSnap.exists()) {
    const data = docSnap.data()
    try{
    return data.score
    } catch(error){
      console.error(error)
    }
  } else {
    console.log('Error: Requested post does not exist.')
  }
}

export async function updatePostInteractionsFromDatabase (postID) { //used for keeping local copies of personal posts up to date with Firebase
  // const postRef = doc(database, 'posts', postID)
  // const postSnap = await getDoc(postRef)
  // if (postSnap.exists()) {
  //   const data = postSnap.data()
  //   return data.score
  // } else {
  //   console.log('Error: Requested post does not exist.')
  // }
}

// user manipulation from local changes
export async function changeUserBiographyInDatabase (mesosphereID, newBio) {
  await updateDoc(doc(database, 'accounts', mesosphereID), {
    biography: newBio
  })
}

export async function changeUserDisplayNameInDatabase (mesosphereID, newDisplayName) {
  await updateDoc(doc(database, 'accounts', mesosphereID), {
    displayname: newDisplayName
  })
}

// testing and validation methods

export async function doesAccountExist (mesosphereID) {
  const accountRef = doc(database, 'accounts', mesosphereID)
  const accountSnap = await getDoc(accountRef)
  return accountSnap.exists()
}

export async function doesPostExist (postID) {
  const postRef = doc(database, 'posts', postID)
  const postSnap = await getDoc(postRef)
  return postSnap.exists()
}

export async function hasInteractedWith (u, postID) {
  const postRef = doc(database, 'posts', postID)
  const postSnap = await getDoc(postRef)
  if (!postSnap.exists()) {
      console.log('Error: Requested post does not exist.')
  }
  return postSnap.data().interactedUsers.some(search => search.user === u.MiD)
}

export { database }
