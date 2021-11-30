import { Alert} from 'react-native'
import { deleteAll, storeData, getData, removeValue, getUser, setScreen, setUser, PAGES, generateUniqueMID, getAllKeys } from './Utility'
import { sha224 } from 'js-sha256'
// import AsyncStorage from '@react-native-async-storage/async-storage'

export class User {
  constructor (username, password, realName, biography, MiD, myPosts) {
    this.username = username
    this.password = password
    this.realName = realName
    this.biography = biography
    if(MiD === "new")
      this.MiD = generateUniqueMID()
    else
      this.MiD = MiD
    if(myPosts === "new")
      this.myPosts = []
    else
      this.myPosts = myPosts
  }

  getUsername () {
    return this.username
  }

  getMiD() {
    return this.MiD
  }

  getHashedPass() {
    return this.password
  }

  addPost(p) {
    this.myPosts.push(p)
  }

  getAllPosts() {
    return this.myPosts
  }

  storeLocally() {
    storeData(this.MiD, this);
  }
}

export async function checkLogin(username, password) {
  accounts = await getAllKeys();
  let found = false;
  for(const MiD of accounts) {
    temp = await getData(MiD)
    if(temp != null) {
      const u = new User(temp.username, temp.password, temp.realName, temp.biography, temp.MiD, temp.myPosts)
      //console.log("Comparing for ID: " + u.getMiD())
      //console.log("Incoming: " + username + " | Expected: " + u.getUsername())
      if(username === u.username) {
        found = true;
        if (String(sha224(String(password))) === u.password) {
          console.log('Password match!  Logging in...')
          setUser(u)
          setScreen(PAGES.ACCOUNTPAGE);
          return;
        }
      }
    }
  }
  if(found) {
    console.log('Password mismatch.')
    Alert.alert(
      'Incorrect Password',
      'The password you entered was incorrect.',
      { text: 'OK' }
    )
    return;
  }
  console.log('User does not exist!  Moving to create account screen...')
  Alert.alert(
    'Incorrect Username',
    'The username you entered was incorrect.',
    { text: 'OK' }
  )
  return;
}


export async function makeAcc (username, password, realName, bio) {
  if (username.length < 3 || password.length < 3) {
    Alert.alert(
      'Format Rejected',
      'Your username and password must be at least 3 characters.',
      { text: 'OK' }
    )
    return
  }
  if (realName.length < 1) {
    Alert.alert(
      'Format Rejected',
      'You must enter a display name.',
      { text: 'OK' }
    )
    return
  }
  const u = new User(username, String(sha224(String(password))), realName, bio, 'new', 'new')
  await storeData(u.getMiD(), u);
  setUser(u)
  setScreen(PAGES.ACCOUNTPAGE)
}

export async function makeAdminAcc () {
  const u = new User('admin', '8f95cfb66890ae8130f3ae7ec288d43ba0d898d60a0823788c6b3408', 'Administrator', 'It\'s a Messosphere in here.', 'meso-0', 'new')
  await storeData('meso-0', u)
}

export async function makeDemoAcc () {
  const u = new User('Demo', 'ccc9c73a37651c6b35de64c3a37858ccae045d285f57fffb409d251d', 'VeryReal Nameson', 'I do so enjoy my <activies>', 'meso-1', 'new')
  await storeData('meso-1', u)
}

export async function adminButton () {
  console.log('Removing everything!')
  await deleteAll()
  console.log('Data removed.  Recreating admin acc...')
  await makeAdminAcc()
  await makeDemoAcc()
  console.log('Done.  Moving to login...')
  setUser(null)
  setScreen(PAGES.LOGIN)
}

export async function deleteCurrUser () {
  const u = getUser()
  removeValue(u.getMiD())
  setUser(null)
  setScreen(PAGES.LOGIN)
}

export default User
