import ScreenGenerator from './ScreenGenerator'
import { PAGES, login, storeData, getData, dataToPost, getPost} from './Utility'
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Button, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { atom, observe, derived} from 'elementos';

export default function App() {
  var postKeys = [];
  var posts = [];
  //var peers = []; //peers
  const inputData$ = atom('');
  const MY_PEER_ID = Math.floor(Math.random() * 1000);

  function dataPrompt() {

    return (
      <View>
        <TextInput
          style={styles.button}
          placeholder='Type your post here!'
          placeholderTextColor='grey'
          onChange={e => inputData$.actions.set(e.target.value)} //updates inputData$ on change
        />
        <Pressable 
          style={styles.button}
          onPress={() => dataToPost(inputData$.get(), postKeys)}
        >
          <Text>Submit post!</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text>Post tester! This should be able to save 'posts' and make them available via WebRTC.</Text>
        {dataPrompt()}
      <Text>Your Peer ID is: {MY_PEER_ID}</Text>
      <StatusBar style="auto" />
      <TextInput 
        style={styles.button}
        placeholder={'Enter Peer ID.'}
      />
      <Pressable
        style={styles.button}
        onPress={() => {alert("Test button.")}}
      >
        <Text>Connect!</Text>
      </Pressable>  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'lightblue',
    margin: 10,
  }
});
