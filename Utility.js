import { StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { atom } from 'elementos'

export const PAGES = {
  LOGIN: 0,
  MAKEACC: 1,
  ACCOUNTPAGE: 2
}

const currUser$ = atom(null)
const currScreen$ = atom(null)

export function setUser (u) {
  currUser$.actions.set(u)
}

export function setScreen (s) {
  currScreen$.actions.set(s)
}

export function getUser () {
  return currUser$.get()
}

export function getScreen () {
  return currScreen$.get()
}

export function returnScreen () {
  return currScreen$
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
  makeAdminAcc()
}

export async function makeAdminAcc() {
  u = new User('admin', 'orangeismyfavoritecolor', 'Administrator', 'It\'s a Wesosphere in here.')
  await storeData(username, u)
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
  button: {
      width: '80%',
      borderRadius: 25,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 40,
      backgroundColor: '#FFA31B'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
