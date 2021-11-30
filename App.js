import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import ScreenGenerator from './ScreenGenerator'
import { atom } from 'elementos'
import { postPage, textContent, createPostPrompt, renderPostByID } from './Post'

export default function App () {

  const Gen = new ScreenGenerator()
  Gen.generateScreen('I changed this line?')
  return (
    //createPostPrompt()
    //This function above is commented out until we merge this branch and get data features
    renderPostByID()
    //the function above is used to render the post, it's being used here for testing purposes and for formatting
  )
}
