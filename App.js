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
