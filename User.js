// import { Alert, AsyncStorage } from 'react-native'
import { storeData, getData, removeValue, getUser, setScreen, setUser, PAGES, generateUniqueMID, getAllKeys } from './Utility'
import { sha224 } from 'js-sha256'
import { pushAccountToDatabase, pushUsernameToDatabase, removeAccountFromDatabase, addPeerToDatabase, removePeerFromDatabase, doesUsernameExist, parseRemoteLogin, pullAccountFromDatabase, sendNotification, removeNotification, removePostFromDatabase } from './firebaseConfig'
import { DebugInstructions } from 'react-native/Libraries/NewAppScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { async } from '@firebase/util'

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
    for (let i = 0; i < this.myPosts.length; i++) {
      if (this.myPosts[i] == p.postID) {
        this.myPosts.splice(i, 1)
        console.log('Removed post locally.  Removing from firebase...')
      }
    }
    removePostFromDatabase(p)
    this.storeLocally()
  }

  getMyPosts () {
    return this.myPosts
  }

  getAllPeers () {
    return this.myPeers
  }

  getNotifications () {
    return this.notifications
  }

  storeLocally () {
    storeData(this.MiD, this)
  }

  addPeer (MID) {
    console.log('Adding peer: ' + MID)
    if (MID.length === 16 && MID.substring(0, 5) === 'meso-') { // validates format, not existence
      console.log('Format validated!')
      this.myPeers.push(MID)
      addPeerToDatabase(this, MID)
      sendNotification(this, MID)
    }
    this.storeLocally()
  }

  removePeer (MID) {
    const index = this.myPeers.indexOf(MID)
    if (index > -1) {
      this.myPeers.splice(index, 1)
      removePeerFromDatabase(this, MID)
      removeNotification(this, MID)
    }
    this.storeLocally()
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
  const passedID = await parseRemoteLogin(username, password)
  console.log('Passed MID: ' + passedID)

  if (passedID === '') {
    alert('Incorrect username and/or password.')
    return
  }
  if (passedID !== '') {
    const retrievedUser = await pullAccountFromDatabase(passedID)
    setUser(retrievedUser)
    await storeData('lastRememberedUser', retrievedUser)
    setScreen(PAGES.ACCOUNTPAGE)
  }
}

export async function makeAcc (username, password, realName, bio) {
  if (username.length < 3 || password.length < 3 || username.length > 25 || password.length > 25) {
    alert('Your username or password must be between 3 and 25 characters.')
    return
  }
  if (realName.length > 25 || realName.length < 3) {
    alert('You must enter a display name between 3 and 25 characters.')
    return
  }
  if (await doesUsernameExist(username) === true) {
    alert('This username already exists, please choose a different one.')
    return
  }
  const u = new User(username, String(sha224(String(password))), realName, bio, 'new', 'new', 'new', 'new')
  pushAccountToDatabase(u)
  pushUsernameToDatabase(username)
  setUser(u)
  await storeData('rememberMe', JSON.stringify(false)) // used for toggling autologin
  await storeData('lastRememberedUser', u) // used for autologin
  setScreen(PAGES.ACCOUNTPAGE)
}

export function changeRealName () {
  alert(this.MiD)
}

export async function deleteCurrUser () {
  const u = getUser()
  removeAccountFromDatabase(u)
  removeValue(u.getMiD())
  removeValue('lastRememberedUser')
  setUser(null)
  setScreen(PAGES.LOGIN)
}

export function dataOccupied (user) { // returns number of bytes
  let bytes = 0
  const posts = user.getMyPosts()
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

export async function lru () {
  await AsyncStorage.getItem('lastRememberedUser').then(value => {
    const data = JSON.parse(value)
    if (data) {
      const nu = new User(data.username, data.password, data.realName, data.biography, data.MiD, data.myPosts, data.myPeers)
      setUser(nu)
      setScreen(PAGES.ACCOUNTPAGE)
    } else {
      return null
    }
  })
}

export async function usernameValidation (username) {
  if (await doesUsernameExist(username) === true) {
    return true
  } else {
    return false
  }
}

export default User
