<<<<<<< HEAD
import { getInstance } from './ScreenGenerator'
import { returnScreen } from './Utility'
import { observe } from 'elementos'
import { useState } from 'react'

let oldscreen = -1

/* packages for this branch: (to uninstall)
 *
 *
 *
 */

export default function App () {
  const [output, setOutput] = useState()
  const Gen = getInstance()

  observe(returnScreen(), (screen) => {
    console.log('Change observed.')
    if (oldscreen !== screen) {
      Gen.selectScreen(screen)
      update()
      oldscreen = screen
    } else {
      console.log('Not moving because old screen is ' + oldscreen + ' and new screen is ' + screen)
    }
  })

  function update () {
    console.log('Update has been called!')
    setOutput(Gen.render())
  }

  return output
=======
import ScreenGenerator from './ScreenGenerator'
import { PAGES, initNode, generatePostID, generateUniqueMID } from './Utility'
import { } from './firebaseConfig'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Pressable, StyleSheet, Text, TextInput, View, AppRegistry, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { atom, observe, derived } from 'elementos'

export default function App () {
  const message$ = atom('')
  const otherPeerID$ = atom(0)
  const myPeerID$ = atom(Math.floor(Math.random() * 999))

  // testing text transmission over p2p w/ bootstrap

  function postPrompt () {
    return (
      <View>
        <Text>Your Peer ID is: {myPeerID$.get()}</Text>
        <Text>Enter a message below!</Text>
        <TextInput
          multiline
          numberOfLines={4}
          placeholder='message'
          onChangeText={(input) => message$.actions.set(input)}
          style={styles.textinput}
        />
        <Pressable
          onPress={() => alert(message$.get())}
          style={styles.loginBtn}
        ><Text>Post!</Text>
        </Pressable>
        <br />
        <Text>Messages: {}</Text>
        <br />
        <TextInput
          placeholder='other peer id'
          onChangeText={(input) => otherPeerID$.actions.set(input)}
        />
        <Pressable
          // onPress={() => translate()} connect to peer
          style={styles.loginBtn}
        ><Text>Connect!</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {postPrompt()}
    </View>
  )
>>>>>>> a9c29b4441ad4a2c481a52a83ad03a6c081fa955
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loginBtn: {
    width: '35%',
    borderRadius: 25,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    backgroundColor: '#FFA31B'
  },
  textinput: {
    borderStyle: 'dashed',
    borderRadius: 5
  }
})
