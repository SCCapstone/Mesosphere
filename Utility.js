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
  VIEWPOSTS: 8,
  SETTINGS: 9,
  CHANGEACCOUNT_DISP: 10,
  CHANGEACCOUNT_PASS: 11,
  CHANGEACCOUNT_BIO: 12,
  VIEW_LOCAL_DATA: 13, 
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
  //console.log("\Utility: Current User:" + JSON.stringify(currUser$.get()));
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

const CARLEIGHS_PALETTE = {
  BLUE_GREEN: '#A4C3B2', // Background of login, user, post pages
  LIGHTER_GREEN: '#CCE3DE', // Post boxes
  LIGHT_GREEN: '#D0DB97', // Username, password, New post text
  DARK_GREEN: '#3A7D44', // Dislike, submit/save post, login
  DARKER_GREEN: '#254D32', // Like
  GRAYED_OUT: '#A9A9A9', // Media
  DARK_GRAY: '#181D27', // Four bar buttons
  BOTTOM_TEXT: '#F5F5F5', // Names on bar buttons
  MESOSPHERE_ORANGE: '#FFA31B', // Unused
  MESOSPHERE_BLUE: '#254DFF', // Unused
}
// TODO(Eventually) This should probably worked into a similar format to our styles pkg.
// Right now, it just mirrors our page consts.
// Also TODO: These names are just yanked out of their contexts and are unchanged... Not very reusable.
export const COLORS = {
  LIKE_BUTTON: CARLEIGHS_PALETTE.DARKER_GREEN,
  DISLIKE_BUTTON: CARLEIGHS_PALETTE.DARK_GREEN,
  LOADING_CIRCLE: "#0000FF", // Default blue for Android OS.
  //LOADING_SCREEN_BACKGROUND: "#ffffff", // This exists in app.json
  BACKGROUND_COLOR: CARLEIGHS_PALETTE.LIGHT_GREEN, // Username and password and new post textbox
  LOGIN_BUTTON: CARLEIGHS_PALETTE.DARK_GREEN,
  REGISTER_BUTTON: '#FF0000', // TODO(Gazdecki) Make Register button use it's own style/color
  POST_BUTTON: CARLEIGHS_PALETTE.DARK_GREEN,
  MEDIA_BUTTON: CARLEIGHS_PALETTE.GRAYED_OUT,
  UNNAMED_BUTTON: '#FF0000', // TODO(Gazdecki) Unused variable.
  BOTTOM_BUTTON_BAR: CARLEIGHS_PALETTE.DARK_GRAY, // TODO(Gazdecki) Unused variable.
  USER_BUTTON: CARLEIGHS_PALETTE.DARK_GRAY,
  USER_BUTTON_PRESSED_BORDER: '#FF0000', // TODO(Gazdecki) Unused variable.
  NETWORK_BUTTON: CARLEIGHS_PALETTE.DARK_GRAY,
  FRIEND_BUTTON: CARLEIGHS_PALETTE.DARK_GRAY,
  FRIEND_BUTTON_PRESSED_BORDER: '#FF0000', // TODO(Gazdecki) Unused variable.
  FRIENDS_AVATAR: '#FF0000', // TODO(Gazdecki) Unused variable.
  POST_BUTTON: CARLEIGHS_PALETTE.DARK_GRAY,
  BOTTOM_BUTTON_TEXT: CARLEIGHS_PALETTE.BOTTOM_TEXT,
  FRIEND_CONTAINER: '#FFFFFF', // Background for list.
  POST_CONTAINER: CARLEIGHS_PALETTE.LIGHTER_GREEN,
  POST_CONTAINER_SHADOW: '#FF0000', // TODO(Gazdecki) Unused variable.
  POST_CONTAINER_BORDER: '#000000',
  POST_VIEW_CONTAINER: CARLEIGHS_PALETTE.DARK_GRAY, // Background for list.
  POST_VIEW_CONTAINER_SHADOW: '#FF0000', // TODO(Gazdecki) Unused variable.
  SECOND_POST_VIEW: '#FF0000', // TODO(Gazdecki) Unused variable.
  UNNAMED_CONTAINER: CARLEIGHS_PALETTE.BLUE_GREEN, // Login, user, and post background.
}

export const styles = StyleSheet.create({
  backBtnLoc: {
    position: 'absolute',
    borderRadius: 25,
    top: 25,
    left: 5,
    borderWidth: 4,
    //backgroundColor: '#FFA31B',
  },
  backBtn: {
    height: 20, //made bigger so they could be clickable on android
    width: 20,
    
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10
  },
  inputView: {
    backgroundColor: COLORS.BACKGROUND_COLOR,
    borderRadius: 30,
    width: '70%',
    height: 45,
    marginBottom: 10,
    marginTop: 10,
    alignItems: 'center'
  },
  inputViewBio: {
    backgroundColor: COLORS.BACKGROUND_COLOR,
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
    marginTop: '8%',
    backgroundColor: COLORS.LOGIN_BUTTON
  },
  registerBtn:{
    width: '80%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '8%',
    backgroundColor: COLORS.REGISTER_BUTTON
  },
  loginText: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  postBtn: {
    backgroundColor: COLORS.POST_BUTTON,
    height: 50,
    width: '80%',
    marginTop: 10,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mediaBtn: {
    backgroundColor: COLORS.MEDIA_BUTTON,
    width: '80%',
    borderRadius: 25,
    height: 50,
    marginTop: 10,
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
    backgroundColor: COLORS.UNNAMED_BUTTON
  },
  bottomButtomBar: {
    position: 'absolute',
    width: '100%',
    borderRadius: 0,
    height: '15%',
    bottom: 0,
    borderWidth: 0,
    borderColor: COLORS.BOTTOM_BUTTON_BAR
  },
  userButton: {
    position: 'absolute',
    width: '25%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderRadius: 2,
    backgroundColor: COLORS.USER_BUTTON
  },
  userButtonSelected: {
    position: 'absolute',
    width: '25%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderRadius: 2,
    borderColor: COLORS.USER_BUTTON_PRESSED_BORDER,
    backgroundColor: COLORS.USER_BUTTON
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
    backgroundColor: COLORS.NETWORK_BUTTON
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
    backgroundColor: COLORS.NETWORK_BUTTON
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
    backgroundColor: COLORS.FRIEND_BUTTON
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
    borderColor: COLORS.FRIEND_BUTTON_PRESSED_BORDER,
    backgroundColor: COLORS.FRIEND_BUTTON
  },
  friendsAvatar: {
    width: '10%',
    height: '300%',
    resizeMode: 'contain',
    marginBottom: 10,
    marginRight: 20,
    backgroundColor: COLORS.FRIENDS_AVATAR
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
    backgroundColor: COLORS.POST_BUTTON
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
    backgroundColor: COLORS.POST_BUTTON
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
    bottom: 0,
    color: COLORS.BOTTOM_BUTTON_TEXT
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
    marginTop: '2%',
    backgroundColor: COLORS.FRIEND_CONTAINER
  },
  postContainer: {
    flex: 1,
    backgroundColor: COLORS.POST_CONTAINER,
    width: '100%',
    marginBottom: '5%',
    padding: '2%',
    borderRadius: 20,
    shadowColor: COLORS.POST_CONTAINER_SHADOW,
    // shadowOffset: {width: -2, height: 4},
    // shadowOpacity: 0.1,
    // shadowRadius: 3, these shadows look best on web/iOS, below is the necessary shadow element for Android
    elevation: 20,
    borderWidth: 2,
    borderColor: COLORS.POST_CONTAINER_BORDER,
  },
  postViewContainer: {
    flex: 1,
    backgroundColor: COLORS.POST_VIEW_CONTAINER,
    width: '100%',
    marginBottom: '22%',
    //padding: '2%',
    //borderRadius: 20,
    shadowColor: COLORS.POST_VIEW_CONTAINER_SHADOW,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  secondPostView:{
    backgroundColor: COLORS.SECOND_POST_VIEW
  },
  postContainerText: {
    padding: '0.5%',
    fontWeight: '400'
  },
  postContainerUsername: {
    padding: '0.5%',
    fontWeight: 'bold',
    fontSize: 16
  },
  bigText: {
    fontSize: 24,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginBottom: '5%'
  },
  smallText: {
    fontSize: 12,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginBottom: '5%'
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.UNNAMED_CONTAINER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallerPostIDText:{
    fontSize: 10,
    fontWeight: 'bold',
    alignItems: 'center',
    textAlign: 'center'
  },
  scoreButtonStyle:{
    flexDirection: 'row',
  },
  scoreButton:{
    justifyContent: 'space-between'
  },
  spacing:{
    width: 15,
    height: 15
  },
  moreSpacing:{
    width: 15
  }
})
