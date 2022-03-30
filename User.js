import { Alert, AsyncStorage } from 'react-native'
import { storeData, getData, removeValue, getUser, setScreen, setUser, PAGES, generateUniqueMID, getAllKeys } from './Utility'
import { sha224 } from 'js-sha256'
import { pushAccountToDatabase, removeAccountFromDatabase, addPeerToDatabase, removePeerFromDatabase, removePostFromDatabase, sendNotification, removeNotification} from './firebaseConfig'
import { DebugInstructions } from 'react-native/Libraries/NewAppScreen'
// import AsyncStorage from '@react-native-async-storage/async-storage'

export class User {
  constructor (username, password, realName, biography, MiD, myPosts, myPeers, notifications) {
    this.username = username
    this.password = password
    this.realName = realName
    this.biography = biography
    if (MiD === 'new') { this.MiD = generateUniqueMID() } else { this.MiD = MiD }
    if (myPosts === 'new') { this.myPosts = [] } else { this.myPosts = myPosts }
    if (myPeers === 'new') { this.myPeers = [] } else { this.myPeers = myPeers }
    if (notifications === 'new') { this.notifications = [] } else { this.notifications = notifications }
  }

  getUsername () {
    return this.username
  }

  getDisplayName () {
    return this.realName
  }

  getBiography () {
    return this.biography
  }

  getMiD () {
    return this.MiD
  }

  getHashedPass () {
    return this.password
  }

  addPost (p) {
    this.myPosts.push(p)
  }

  removePost (p) {
    for( var i = 0; i < this.myPosts.length; i++){ 
      if (this.myPosts[i].postID == p.postID) { 
        this.myPosts.splice(i, 1); 
        console.log("Removed post locally.  Removing from firebase...")
      }
    }
    removePostFromDatabase(p);
    this.storeLocally();
    
  }

  getMyPosts () {
    return this.myPosts
  }

  getAllPeers () {
    return this.myPeers
  }

  getNotifications () {
    return this.notifications;
  }

  storeLocally () {
    storeData(this.MiD, this)
  }

  addPeer (MID) {
    console.log("Adding peer: "+ MID)
    if (MID.length === 16 && MID.substring(0, 5) === 'meso-') { // validates format, not existence
      console.log("Format validated!")
      this.myPeers.push(MID);
      addPeerToDatabase(this, MID);
      sendNotification(this,MID);
    }
    this.storeLocally ();
  }

  removePeer (MID) {
    const index = this.myPeers.indexOf(MID);
    if(index > -1) {
      this.myPeers.splice(index, 1);
      removePeerFromDatabase(this, MID);
      removeNotification(this, MID);
    }
    this.storeLocally ();
  }

  setRealName (newName) {
    this.realName = newName
  }

  setNewPassword (newPassword) {
    this.password = newPassword
  }

  setNewBiography (newBiography) {
    this.biography = newBiography
  }
}

export async function checkLogin (username, password) {
  const accounts = await getAllKeys()
  let found = false
  for (const MiD of accounts) {
    const temp = await getData(MiD)
    if (temp != null) {
      const u = new User(temp.username, temp.password, temp.realName, temp.biography, temp.MiD, temp.myPosts, temp.myPeers)
      if (username === u.username) {
        found = true
        if (String(sha224(String(password))) === u.password) {
          console.log('Password match!  Logging in...')
          setUser(u)
          setScreen(PAGES.ACCOUNTPAGE)
          return
        }
      }
    }
  }
  if (found) {
    console.log('Password mismatch.')
    alert('Incorrect password.')
    return
  }
  console.log('User (' + username + ') does not exist!')
  alert('Incorrect username.')
}

export async function makeAcc (username, password, realName, bio) {
  if (username.length < 3 || password.length < 3) {
    alert('Your username or password must be at least 3 characters')
    return
  }
  if (realName.length < 1) {
    alert('You must enter a display name.')
  }
  const u = new User(username, String(sha224(String(password))), realName, bio, 'new', 'new', 'new', 'new')
  await storeData(u.getMiD(), u)
  pushAccountToDatabase(u)
  setUser(u)
  setScreen(PAGES.ACCOUNTPAGE)
}

export function changeRealName () {
  alert(this.MiD)
}

export async function deleteCurrUser () {
  const u = getUser()
  removeAccountFromDatabase(u)
  removeValue(u.getMiD())
  setUser(null)
  setScreen(PAGES.LOGIN)
}

export function dataOccupied(user) { //returns number of bytes
  let bytes = 0
  let posts = user.getMyPosts()
  for (let i = 0; i < user.myPosts.length; i++) {
    bytes += ~-encodeURI(
      posts[i].attachedMiD +
      posts[i].postID + 
      posts[i].score + 
      posts[i].textContent +
      posts[i].timestamp
    ).split(/%..|./).length
  }
  return bytes
}


export default User
