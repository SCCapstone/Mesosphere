import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import ScreenGenerator from './ScreenGenerator'
import { atom } from 'elementos'
import { postPage, textContent, createPost } from './Post'


export default function App () {
  const Gen = new ScreenGenerator()
  Gen.generateScreen('I changed this line?')
  // return;
  return createPost();
}
