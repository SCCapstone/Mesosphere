import ScreenGenerator from './ScreenGenerator'
import { PAGES, getAllMID, getMIDS, returnCreateTime} from './Utility'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { Button, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { atom, observe, derived } from 'elementos'

export default function App () {
  return (
    <View style={styles.container}>
      <Text>This is a test to read all stored MIDs in database. The value below should read 135. </Text>
      <Text>MIDs: </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
