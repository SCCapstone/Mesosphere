import { initializeApp } from 'firebase/app'
import { getFirestore, doc, collectionGroup, getDoc, getDocs, setDoc, updateDoc, arrayUnion, arrayRemove, deleteDoc, increment, DocumentSnapshot, query, collection, where } from 'firebase/firestore/lite'
import { Post } from './Post'
import { User } from './User'
import { sha224 } from 'js-sha256'
// import { setScreen, setUser, PAGES } from './Utility'

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
const usernameRef = doc(database, 'main', 'Usernames')

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
  if (docSnap.size != 0) {
    for (const document of docSnap.docs) {
      activeIDs.push(document.data().MID)
    }
  } else {
    console.log('No active IDs!')
  }
  return activeIDs
}

export async function returnPostIDDatabaseLength () {
  const IDSSnap = await getDoc(IDSRef)
  if (IDSSnap.exists()) {
    // console.log(IDSSnap.data().postIDs)
    return IDSSnap.data().postIDs.length
  }
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

export async function pushUsernameToDatabase (username) {
  await updateDoc(usernameRef, {
    usernames: arrayUnion(username)
  })
}

export async function removeUsernameFromDatabase (username) {
  await updateDoc(usernameRef, {
    usernames: arrayRemove(username)
  })
}

export async function pushAccountToDatabase (u) {
  await setDoc(doc(database, 'accounts', u.MiD), {
    MID: u.MiD,
    biography: u.biography,
    username: u.username,
    displayname: u.realName,
    friends: u.myPeers,
    posts: u.myPosts,
    password: u.password,
    notifications: u.notifications
  })
}

export async function pullAccountFromDatabase (mesosphereID) {
  const userRef = doc(database, 'accounts', mesosphereID)
  const docSnap = await getDoc(userRef)
  if (docSnap.exists()) {
    const data = docSnap.data()
    console.log('Document data:', docSnap.data())
    return new User(data.username, data.password, data.displayname, data.biography, data.MID, data.posts, data.friends)
  } else {
    console.log('Error: Requested acc does not exist.')
    return null
  }
}

export async function removeAccountFromDatabase (u) {
  await deleteDoc(doc(database, 'accounts', u.MiD))
  await updateDoc(usernameRef, {
    usernames: arrayRemove(u.username)
  })
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
}

export async function alterPostScoreClean (postID, change) {
  const postRef = doc(database, 'posts', postID)
  await updateDoc(doc(database, 'posts', postID), {
    score: increment(change)
  })
  // Post component handles interaction
}

export async function addUserInteraction (u, postID, change) {
  let actionTaken = ''
  if (change > 0) {
    actionTaken = 'like'
  } else {
    actionTaken = 'dislike'
  }

  await updateDoc(doc(database, 'posts', postID), { // updates interactedUsers in the post with the MID and action taken
    interactedUsers: arrayUnion(
      {
        user: u.MiD,
        action: actionTaken
      }
    )
  })
} // NOTE: arrayUnion ensures that an interaction either like/dislike can only appear once each time per user, however, the score can keep increasing if validation isn't ensured

export async function removeInteractions (u, postID) {
  while (await hasInteractedWith(u, postID)) {
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
  console.log('i am a post puller for post ' + postID)
  const postRef = doc(database, 'posts', postID)
  console.log('and i will not elp you')
  const docSnap = await getDoc(postRef)
  console.log(docSnap)
  if (docSnap.exists()) {
    console.log('Doc Snap exists!')
    const data = docSnap.data()
    console.log('Document data:', docSnap.data())
    console.log(data.timestamp)
    return new Post(data.MID, data.postID, null, data.text, data.score, data.interactedUsers, data.timestamp)
  } else {
    console.log('Error: Requested post does not exist.')
    return null
  }
}

export async function getScoreFromPostInDatabase (postID) {
  const postRef = doc(database, 'posts', postID)
  const docSnap = await getDoc(postRef)
  if (docSnap.exists()) {
    const data = docSnap.data()
    try {
      return data.score
    } catch (error) {
      console.error(error)
    }
  } else {
    console.log('Error: Requested post does not exist.')
  }
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

export async function changeUserPasswordInDatabase (mesosphereID, newPassword) {
  await updateDoc(doc(database, 'accounts', mesosphereID), {
    password: newPassword
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

export async function doesUsernameExist (username) {
  const uSnap = await getDoc(usernameRef)
  // console.log(uSnap.data().usernames.includes(username))
  if (uSnap.data().usernames.includes(username)) {
    return true
  } else {
    return false
  }
}

// remote login

export async function parseRemoteLogin (username, password) {
  let dataString = ''
  const q = query(collection(database, 'accounts'), where('username', '==', username), where('password', '==', String(sha224(String(password)))))
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => {
    // console.log(doc.data())
    // setUser(pullAccountFromDatabase(doc.data.MID))
    // setScreen(PAGES.ACCOUNTPAGE)
    // console.log(doc.data().MID)
    dataString += doc.data().MID
    // return doc.data().MID
  })
  return dataString
}


export async function parseRemoteLoginEncrypted (username, password) {
  let dataString = ''
  const q = query(collection(database, 'accounts'), where('username', '==', username), where('password', '==', password))
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => {
    // console.log(doc.data())
    // setUser(pullAccountFromDatabase(doc.data.MID))
    // setScreen(PAGES.ACCOUNTPAGE)
    // console.log(doc.data().MID)
    dataString += doc.data().MID
    // return doc.data().MID
  })
  return dataString
}


// notifications

export async function sendNotification (u, recipientID) {
  // If this user doesn't have me as a friend yet
  const peer = await pullAccountFromDatabase(recipientID)
  if (!(peer.getAllPeers().includes(u.MiD))) {
    await updateDoc(doc(database, 'accounts', recipientID), {
      notifications: arrayUnion(u.MiD)
    })
  }
}

export async function removeNotification (u, notificationMID) {
  await updateDoc(doc(database, 'accounts', u.MiD), {
    notifications: arrayRemove(notificationMID)
  })
}
/**
 * User removes a notification on their account.
 * This should happen upon accepting the friend request, or manual deletion of the notification with no action taken.
 */

export async function pullNotifications (u) {
  const accountRef = doc(database, 'accounts', u.MiD)
  const accountSnap = await getDoc(accountRef)
  const notis = []
  const data = accountSnap.data()
  // console.log(data.notifications)
  try {
    if(data.notifications && data.notifications.size != 0) {
      console.log(data.notifications)
      return data.notifications
    } else {
      console.log('No notifications for this user.')
      return null
    }
  } catch (e) {
    console.log("Try/Catch triggered!  Error:")
    console.log(e)
    return null
  }
}

export async function getDisplayNameFromMID (MID) {
  const accountRef = doc(database, 'accounts', MID)
  const accountSnap = await getDoc(accountRef)
  const data = accountSnap.data()
  if (data) {
    return data.displayname
  } else {
    console.log('Error!')
  }
}

export { database }
