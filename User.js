import React from 'react'
import { Alert, TouchableOpacity, Text, TextInput, View } from 'react-native'
import { deleteAll, storeData, getData, removeValue, styles, getUser, setScreen, setUser, PAGES } from './Utility'
import { atom } from 'elementos'
// import AsyncStorage from '@react-native-async-storage/async-storage'

export class User {
  constructor (username, password, realName, biography) {
    this.username = username
    this.password = password
    this.realName = realName
    this.biography = biography
  }

  getUsername () {
    return this.username
  }
}

export async function checkLogin (username, password) {
  // username = String(username);
  if (await getData(username) != null) {
    console.log('User exists!  Checking password...')
    const temp = await getData(username)
    const u = new User(temp.username, temp.password, temp.realName, temp.biography)
    if (password === u.password) {
      console.log('Password match!  Logging in...')
      setUser(u)
      setScreen(PAGES.ACCOUNTPAGE)
    } else {
      console.log('Password mismatch.')
      Alert.alert(
        'Incorrect Password',
        'The password you entered was incorrect.',
        { text: 'OK' }
      )
    }
  } else {
    console.log('User does not exist!  Moving to create account screen...')
    Alert.alert(
      'Incorrect Username',
      'The username you entered was incorrect.',
      { text: 'OK' }
    )
  }
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
  const u = new User(username, password, realName, bio)
  await storeData(username, u)
  setUser(u)
  setScreen(PAGES.ACCOUNTPAGE)
}

export async function makeAdminAcc () {
  const u = new User('admin', 'orangeismyfavoritecolor', 'Administrator', 'It\'s a Messosphere in here.')
  await storeData('admin', u)
}

export async function makeDemoAcc () {
  const u = new User('demo', 'pass', 'VeryReal Nameson', 'I do so enjoy my <activies>')
  await storeData('demo', u)
}

export async function adminButton () {
  console.log('Removing everything!')
  await deleteAll()
  console.log('Data removed.  Recreating admin acc...')
  await makeAdminAcc()
  console.log('Done.  Moving to login...')
  setUser(null)
  setScreen(PAGES.LOGIN)
}

export async function deleteCurrUser () {
  const u = getUser()
  removeValue(u.getUsername())
  setUser(null)
  setScreen(PAGES.LOGIN)
}

export default User
