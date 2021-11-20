import ScreenGenerator from './ScreenGenerator'
import { PAGES, initNode } from './Utility'
import { returnDatabaseMIDS, returnTestData, pushMIDToDatabase } from './firebaseConfig'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { Button, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { atom, observe, derived } from 'elementos'

export default function App () {
  const message$ = atom('')
  const otherPeerID$ = atom(0)
  const myPeerID$ = atom(Math.floor(Math.random() * 999))
  const peers = []
  const received = [] // data received from other peer

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
          onPress={() => translate()}
          style={styles.loginBtn}
        ><Text>Post!</Text>
        </Pressable>
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

        <Text>Database MIDs: {}</Text>

      </View>
    )
  }

  function translate () {
    alert(message$.get())
  }

  return (
    <View style={styles.container}>
      {postPrompt()}
      {/* <Text>{returnDatabasePostIDS}</Text> */}
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
