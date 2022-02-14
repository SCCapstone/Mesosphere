import { StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { atom } from 'elementos'
import { sha224 } from 'js-sha256'
import { returnMIDSDatabaseLength, returnPostIDDatabaseLength, pushMIDToDatabase, pushPostIDToDatabase } from './firebaseConfig.js'

export const PAGES = {
  LOGIN: 0,
  MAKEACC: 1,
  ACCOUNTPAGE: 2,
  FRIENDSLIST: 3,
  DIRECTMESSAGES: 4,
  NEWFRIEND: 5,
  FRIEND: 6,
  MAKEPOST: 7,
  VIEWPOSTS: 8
}

const currUser$ = atom(null)
const currScreen$ = atom(null)
const currFocus$ = atom(null)

export function setUser (u) {
  currUser$.actions.set(u)
}

export function setScreen (s) {
  currScreen$.actions.set(s)
}

export function getUser () {
  if(currUser$ == null)
    console.log("Null current user! (Error state)")
  console.log(currUser$.get());
  return currUser$.get()
}

export function getScreen () {
  return currScreen$.get()
}

export function returnScreen () {
  return currScreen$
}

export function getFocus () {
  return currFocus$.get()
}

export function setFocus (f) {
  return currFocus$.actions.set(f);
}

export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
  } catch (e) {
    // Saving error
  }
}

export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key)
    if (jsonValue !== null) {
      return JSON.parse(jsonValue)
    }
    console.log('Data pertaining to ' + key + ' not found.')
    return null
  } catch (e) {
    // error reading value
  }
}

export async function removeValue (key) {
  try {
    await AsyncStorage.removeItem(key)
  } catch (e) {
    // removal error
  }
}

export async function deleteAll () {
  let keys = []
  try {
    keys = await AsyncStorage.getAllKeys()
  } catch (e) {
    // read key error
  }
  await AsyncStorage.multiRemove(keys)
  console.log('All data removed.')
}

export async function getAllKeys () {
  let keys = []
  try {
    keys = await AsyncStorage.getAllKeys()
    // console.log(keys)
    return keys
  } catch (e) {
    // read key error
  }
  return null
  // example console.log result:
  // ['@MyApp_user', '@MyApp_key']
}

export function generateUniqueMID () {
  const magicNumber = returnMIDSDatabaseLength() + (Math.random() * 1)
  const ID = 'meso-' + String(sha224(String(magicNumber))).substring(0, 11) // will always be random since we're hashing array length in an immutable array, using 224 for smaller footprint
  AsyncStorage.setItem('MID', ID)
  pushMIDToDatabase(ID)
  return ID
}

export function generatePostID () {
  const magicNumber = returnPostIDDatabaseLength() + (Math.random() * 1)
  const ID = String(sha224(String(magicNumber)))
  pushPostIDToDatabase(ID)
  return ID // this value is to be used when creating a new post! also should be added to the current User's array of post IDs
}

export const styles = StyleSheet.create({
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10
  },
  inputView: {
    backgroundColor: '#FFD89F',
    borderRadius: 30,
    width: '70%',
    height: 45,
    marginBottom: 10,
    marginTop: 10,
    alignItems: 'center'
  },
  inputViewBio: {
    backgroundColor: '#FFD89F',
    borderRadius: 30,
    width: '70%',
    height: 80,
    marginBottom: 10,
    marginTop: 10,
    alignItems: 'center'
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20
  },
  loginBtn: {
    width: '80%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    backgroundColor: '#FFA31B'
  },
  loginText: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  postBtn: {
    backgroundColor: '#FFA31B',
    height: 50,
    width: '80%',
    marginTop: 10,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageBtn: {
    backgroundColor: '#FFA31B',
    width: '20%',
    borderRadius: 25,
    height: 50,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    width: '25%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    backgroundColor: '#FFA31B'
  },
  bottomButtomBar: {
    position: 'absolute',
    width: '100%',
    borderRadius: 0,
    height: '15%',
    bottom: 0,
    borderWidth: 0,
    borderColor: '#FFA31B'
  },
  userButton: {
    position: 'absolute',
    width: '25%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderRadius: 2,
    backgroundColor: '#FFD89F'
  },
  userButtonSelected: {
    position: 'absolute',
    width: '25%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderRadius: 2,
    borderColor: '#FFA31B',
    backgroundColor: '#FFFFFF'
  },
  networkButton: {
    position: 'absolute',
    width: '25%',
    left: '25%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderRadius: 2,
    backgroundColor: '#FFD89F'
  },
  networkButtonSelected: {
    position: 'absolute',
    width: '25%',
    left: '25%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderRadius: 2,
    backgroundColor: '#FFFFFF'
  },
  friendButton: {
    position: 'absolute',
    width: '25%',
    left: '50%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderRadius: 2,
    backgroundColor: '#FFD89F'
  },
  friendButtonSelected: {
    position: 'absolute',
    width: '25%',
    left: '50%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderRadius: 2,
    borderColor: '#FFA31B',
    backgroundColor: '#FFFFFF'
  },
  friendsAvatar: {
    width: '10%',
    height: '300%',
    resizeMode: 'contain',
    marginBottom: 10,
    marginRight: 20,
    backgroundColor: '#000'
  },
  postButton: {
    position: 'absolute',
    left: '75%',
    width: '25%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderRadius: 2,
    backgroundColor: '#FFD89F'
  },
  postButtonSelected: {
    position: 'absolute',
    left: '75%',
    width: '25%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderRadius: 2,
    backgroundColor: '#FFFFFF'
  },
  friendsLogo: {
    top: '17%',
    left: '50%',
    width: 50,
    height: 50
  },
  friendsLabel: {
    top: '18%',
    left: '48.5%', // better alignment, temp
    justifyContent: 'center',
    height: 100,
    width: 100
  },
  bottomButtonText: {
    position: 'absolute',
    bottom: 0
  },
  bottomButtonIcon: {
    position: 'absolute',
    width: '60%',
    height: '60%',
    resizeMode: 'contain',
    bottom: '30%'
  },
  friendList: {
    top: '20%',
    left: '50%',
    alignContent: 'center',
    width: 100,
    height: 100
  },
  friendContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  postContainer: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    marginBottom: '5%',
    padding: '2%',
    borderRadius: 20,
    shadowColor: 'grey',
    // shadowOffset: {width: -2, height: 4},
    // shadowOpacity: 0.1,
    // shadowRadius: 3, these shadows look best on web/iOS, below is the necessary shadow element for Android
    elevation: 20
  },
  postViewContainer: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    marginBottom: '22%',
    padding: '2%',
    borderRadius: 20,
    shadowColor: 'grey',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  postContainerText: {
    padding: '0.5%',
    fontWeight: '400'
  },
  bigText: {
    fontSize: 24,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginBottom: '5%'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
