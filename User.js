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

export function accountPage () {
  const u = getUser()
  return (
    <>
      <Text>Welcome back, {u.realName}</Text>
      {adminCheck()}
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => {
          setUser(null)
          setScreen(PAGES.LOGIN)
        }}
      >
        <Text style={styles.loginText}>LOGOUT</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => deleteCurrUser()}
      >
        <Text style={styles.loginText}>Delete My Data</Text>
      </TouchableOpacity>
    </>
  )
}

export function newUserPrompt () {
  const username$ = atom('')
  const password$ = atom('')
  const dispname$ = atom('')
  const biography$ = atom('')
  return (
    <>
      <Text>Please enter your information.</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder='Username'
          placeholderTextColor='#003f5c'
          returnKeyType='next'
          maxLength={30}
          onChangeText={(username) => username$.actions.set(username)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder='Password.'
          placeholderTextColor='#003f5c'
          secureTextEntry
          returnKeyType='next'
          maxLength={50}
          onChangeText={(password) => password$.actions.set(password)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder='Display Name.'
          placeholderTextColor='#003f5c'
          returnKeyType='next'
          maxLength={30}
          onChangeText={(dispname) => dispname$.actions.set(dispname)}
        />
      </View>
      <View style={styles.inputViewBio}>
        <TextInput
          multiline
          numberOfLines={3}
          style={styles.TextInput}
          placeholder='Enter a short biography!'
          placeholderTextColor='#003f5c'
          returnKeyType='done'
          blurOnSubmit
          maxLength={240}
          onChangeText={(biography) => biography$.actions.set(biography)}
        />
      </View>
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => makeAcc(String(username$.get()), String(password$.get()), String(dispname$.get()), String(biography$.get()))}
      >
        <Text style={styles.loginText}>CREATE ACCOUNT</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => setScreen(PAGES.LOGIN)}
      >
        <Text style={styles.loginText}>CANCEL</Text>
      </TouchableOpacity>
    </>
  )
}
export function loginScreen () {
  const username$ = atom('')
  const password$ = atom('')
  return (
    <>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder='Username.'
          placeholderTextColor='#003f5c'
          returnKeyType='next'
          maxLength={30}
          onChangeText={(username) => username$.actions.set(username)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder='Password.'
          placeholderTextColor='#003f5c'
          secureTextEntry
          returnKeyType='done'
          maxLength={50}
          onChangeText={(password) => password$.actions.set(password)}
        />
      </View>
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => checkLogin(String(username$.get()), String(password$.get()))}
      >
        <Text style={styles.loginText}>LOGIN</Text>

      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => setScreen(PAGES.MAKEACC)}
      >
        <Text style={styles.loginText}>REGISTER</Text>

      </TouchableOpacity>
    </>
  )
}

async function checkLogin (username, password) {
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

async function makeAcc (username, password, realName, bio) {
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
  const u = new User('admin', 'orangeismyfavoritecolor', 'Administrator', 'It\'s a Wesosphere in here.')
  await storeData('admin', u)
}

function adminCheck () {
  const u = getUser()
  if (u != null && u.getUsername() === 'admin') {
    return (
      <TouchableOpacity
        onPress={() => { adminButton() }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Delete ALL Data</Text>
      </TouchableOpacity>
    )
  }
}

async function adminButton () {
  console.log('Removing everything!')
  await deleteAll()
  console.log('Data removed.  Recreating admin acc...')
  await makeAdminAcc()
  console.log('Done.  Moving to login...')
  setUser(null)
  setScreen(PAGES.LOGIN)
}

async function deleteCurrUser () {
  const u = getUser()
  removeValue(u.getUsername())
  setUser(null)
  setScreen(PAGES.LOGIN)
}

export default User
