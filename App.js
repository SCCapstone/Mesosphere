import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenGenerator from './ScreenGenerator';

export default function App() {
  var Gen = new ScreenGenerator();
  Gen.generateScreen("Hey! >:(");
  //return;
  return (
    <View style={styles.container}><Text>{Gen.render()}</Text></View>
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
