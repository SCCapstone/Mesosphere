import { Alert, AsyncStorage } from 'react-native'
import { storeData, getData, removeValue, getUser, setScreen, setUser, PAGES, generateUniqueMID, getAllKeys } from './Utility'
import { sha224 } from 'js-sha256'
import { doesAccountExist, pushAccountToDatabase, removeAccountFromDatabase } from './firebaseConfig'

export class User {
  constructor (username, password, realName, biography, MiD, myPosts, myPeers) {
    this.username = username
    this.password = password
    this.realName = realName
    this.biography = biography
    if (MiD === 'new') { this.MiD = generateUniqueMID() } else { this.MiD = MiD }
    if (myPosts === 'new') { this.myPosts = [] } else { this.myPosts = myPosts }
    if (myPeers === 'new') { this.myPeers = [] } else { this.myPeers = myPeers }
  }

  getUsername () {
    return this.username
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

  getAllPosts () {
    return this.myPosts
  }

  getAllPeers () {
    return this.myPeers
  }

  storeLocally () {
    storeData(this.MiD, this)
  }

  addPeer (MID) {
    if (MID.length === 16 && MID.substring(0, 5) === 'meso-' && doesAccountExist(MID)) { // validates format, not existence
      this.myPeers.push(MID)
      addPeerToDatabase(this, MID)
    }
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
  console.log('User does not exist!  Moving to create account screen...')
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
  const u = new User(username, String(sha224(String(password))), realName, bio, 'new', 'new', 'new')
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

export default User
