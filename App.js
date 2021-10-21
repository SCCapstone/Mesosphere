import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenGenerator from './ScreenGenerator';

export default function App() {
  var Gen = new ScreenGenerator();
  Gen.generateScreen("I changed this line");
  //return;
  return (
    <View style={styles.container}>
      <Text>{Gen.render()}</Text>
      <Text>My very own commit!</Text>
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
});
