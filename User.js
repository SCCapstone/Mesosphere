import React, { Component, useState } from 'react'
import { TouchableOpacity, Text, TextInput, View } from 'react-native'
import { storeData, getData, styles, setScreen, PAGES } from './Utility'
import { atom } from 'elementos'
// import AsyncStorage from '@react-native-async-storage/async-storage'

export class User extends Component {
  constructor (username, password, realName, DOB, biography) {
    super()
    this.username = username
    this.password = password
    this.realName = realName
    this.DOB = DOB
    this.biography = biography
  }
}

export function accountPage () {
  return (
    <Text>Welcome to the account page.</Text>
  )
}

export function newUserPrompt () {
  return (
    <Text>Welcome to the new user prompt.</Text>
  )
}

const username$ = atom('');
const password$ = atom('');

export function loginScreen () {

  return (
    <>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder='Username.'
          placeholderTextColor='#003f5c'
          onChangeText={(username) => username$.actions.set(username)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder='Password.'
          placeholderTextColor='#003f5c'
          secureTextEntry
          onChangeText={(password) => password$.actions.set(password)}
        />
      </View>
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => checkLogin(username$.get(), password$.get())}
      >
        <Text style={styles.loginText}>LOGIN</Text>

      </TouchableOpacity>
    </>
  )
}

async function checkLogin (username, password) {
    username = String(username);
    if (await getData(username) != null) {
    console.log('User exists!  Checking password...')
    const temp = await getData(username)
    const u = new User(temp.username, temp.password, temp.realName, temp.DOB, temp.biography)
    if (password === u.password) {
      console.log('Password match!  Logging in...')
    } else {
      console.log('Password mismatch.')
    }
    } else {
    console.log('User does not exist!  Moving to create account screen...')
    setScreen(PAGES.MAKEACC)
  }
}

export default User
