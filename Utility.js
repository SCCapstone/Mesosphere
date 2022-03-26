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
const CARLEIGH_GREEN = {
  // LIGHTER_GREEN: '#CCE3DE', // Previously post boxes. Now Unused, sorry.
  // BOTTOM_TEXT: '#F5F5F5', // Previously only text on bar.
  BACKGROUND: '#a4c3b2', // Blue-green
  TEXT_BOX: '#d0db97', // Light-green
  BUTTON: '#3a7d44', // Dark green
  BAR: '#181d27', // Dark gray, blue shifted
  BAR_LOCATION: '#909090', // Dark gray
  TEXT: '#ffffff', // Black.
  DISLIKE_BUTTON: '#3a7d44', // Dark green
  LIKE_BUTTON: '#254d32', // Darker green
}
const ADAM_GRAY = {
  // The Comments on the right are a recommendation from reading app-dev blogs.
  BACKGROUND: '#ffffff', // Black, white, or close to that color.
  TEXT_BOX: '#ededed', // Shifted away from background.
  BUTTON: '#808080', // Shifted moreso away from background. Aim for constrast.
  BAR: '#000000', // Black, white, or close to those colors. Different from BACKGROUND.
  BAR_LOCATION: '#909090', // Highlight BAR's color to show user they are on that page.
  TEXT: '#ffffff', // Black or White only.
  // Text warning, the bottom bar's images and text will always be white.
  LIKE_BUTTON: '#707070',
  DISLIKE_BUTTON: '#606060', // Should be variations similar to BUTTON.
}
const MESO_CLASSIC = {
  BACKGROUND: '#cff7ff', // Very light Blue
  TEXT_BOX: '#a7cfff', // Light Blue
  BUTTON: '#ffa31b', // Orange
  BAR: '#ffa31b', // Orange
  BAR_LOCATION: '#ffcb43', // Light orange
  TEXT: '#ffffff', // Black
  LIKE_BUTTON: '#254dff', // Blue
  DISLIKE_BUTTON: '#072fe1', // Dark blue
}
// These are the exported color values.
// Different palettes can be swapped in and out here.
// Feel free to add more values for custom coloring.
export const COLORS = {
  // TODO(Gazdecki) I would bet money there's a better way to change this...
  // As long as it's export-able still.
  LOADING_CIRCLE: "#0000ff", // Default blue for Android OS.
  MEDIA_BUTTON:   "#a9a9a9", // Grayed out.
  BACKGROUND:     CARLEIGH_GREEN.BACKGROUND,
  TEXT_BOX:       CARLEIGH_GREEN.TEXT_BOX,
  BUTTON:         CARLEIGH_GREEN.BUTTON,
  BAR:            CARLEIGH_GREEN.BAR,
  BAR_LOCATION:   CARLEIGH_GREEN.BAR_LOCATION,
  TEXT:           CARLEIGH_GREEN.TEXT,
  DISLIKE_BUTTON: CARLEIGH_GREEN.DISLIKE_BUTTON,
  LIKE_BUTTON:    CARLEIGH_GREEN.LIKE_BUTTON,
}

// No more defining long-term colors inside the style sheet. Please.
export const styles = StyleSheet.create({
  backBtnLoc: {
    position: 'absolute',
    borderRadius: 25,
    top: 25,
    left: 5,
    borderWidth: 4,
  },
  backBtn: {
    height: 20, //made bigger so they could be clickable on android
    width: 20,
  },
  XBtnLoc: {
    position: 'absolute',
    borderRadius: 25,
    top: -10,
    left: -10,
    borderWidth: 4,
    //
  },
  PickerStyle: {
    alignSelf: 'flex-end',
    height: 50, 
    width: 180,
    borderRadius: 2,
    borderWidth: 4,
    color: '#F5F5F5',
    elevation: 3,
    position: 'absolute',
    top: -5
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10
  },
  inputView: {
    backgroundColor: COLORS.TEXT_BOX,
    borderRadius: 30,
    width: '70%',
    height: 45,
    marginBottom: 10,
    marginTop: 10,
    alignItems: 'center'
  },
  inputViewBio: {
    backgroundColor: COLORS.TEXT_BOX,
    borderRadius: 30,
    width: '70%',
    height: 80,
    marginBottom: 10,
    marginTop: 10,
    alignItems: 'center'
  },
  TextInput: {
    width: "98%",
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
    textAlign:'center'
  },
  loginBtn: {
    width: '80%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '8%',
    backgroundColor: COLORS.BUTTON
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
    backgroundColor: COLORS.BUTTON,
    height: 50,
    width: '80%',
    marginTop: 10,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mediaBtn: { // Special Case for greyed out and disabled button.
    // backgroundColor: COLORS.BUTTON,
    backgroundColor: COLORS.MEDIA_BUTTON,
    width: '80%',
    borderRadius: 25,
    height: 50,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomButtomBar: {
    position: 'absolute',
    width: '100%',
    borderRadius: 0,
    height: '15%',
    bottom: 0,
    borderWidth: 0,
  },
  userButton: {
    position: 'absolute',
    width: '25%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderRadius: 2,
    marginTop: 0,
  },
  userButtonSelected: {
    position: 'absolute',
    width: '25%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderRadius: 2,
    backgroundColor: COLORS.BAR_LOCATION
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
    backgroundColor: COLORS.BAR
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
    backgroundColor: COLORS.BAR_LOCATION
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
    backgroundColor: COLORS.BAR
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
    backgroundColor: COLORS.BAR_LOCATION
  },
/*
  // Unused
  friendsAvatar: {
    width: '10%',
    height: '300%',
    resizeMode: 'contain',
    marginBottom: 10,
    marginRight: 20,
    backgroundColor: COLORS.<>
  },
*/
  postButton: {
    position: 'absolute',
    left: '75%',
    width: '25%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderRadius: 2,
    backgroundColor: COLORS.BAR
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
    backgroundColor: COLORS.BAR_LOCATION
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
    color: COLORS.TEXT
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
    backgroundColor: COLORS.BACKGROUND
  },
  postContainer: {
    flex: 1,
    backgroundColor: COLORS.TEXT_BOX,
    width: '100%',
    marginBottom: '5%',
    padding: '2%',
    borderRadius: 20,
    // shadowColor: COLORS.<>,
    // shadowOffset: {width: -2, height: 4},
    // shadowOpacity: 0.1,
    // shadowRadius: 3, these shadows look best on web/iOS, below is the necessary shadow element for Android
    elevation: 20,
    borderWidth: 2,
    // borderColor: COLORS.<>,
  },
  postViewContainer: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    width: '100%',
    marginBottom: '23%',
/*
    //padding: '2%',
    //borderRadius: 20,
    shadowColor: COLORS.<>,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 3
*/
  },
  memoryViewContainer: {
    flex: 1,
    backgroundColor: '#181D27',
    width: '60%',
    marginTop: '2%',
    padding: '2%',
    //padding: '2%',
    //borderRadius: 20,
    shadowColor: 'grey',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 3
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
  container: { // This is used in screens: login, user, and post.
    // TODO(Gazdecki) It probably shouldn't be in all those places.
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
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
})  // End of styles list.
