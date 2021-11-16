import ScreenGenerator from './ScreenGenerator'
import { PAGES, initNode } from './Utility'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { Button, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { atom, observe, derived } from 'elementos'

export default function App () {
  const message$ = atom('')

  function postPrompt () {
    return (
      <View>
        <Text>Enter a message below!</Text>
        <TextInput
          multiline
          numberOfLines={4}
          placeholder='message'
          onChangeText={(input) => message$.actions.set(input)}
        />
        <Pressable
          onPress={() => translate()}
          style={styles.loginBtn}
        ><Text>Post!</Text>
        </Pressable>
      </View>
    )
  }

  function translate () {
    alert(message$.get())
  }

  initNode()

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
    width: '30%',
    borderRadius: 25,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    backgroundColor: '#FFA31B'
  }
})
