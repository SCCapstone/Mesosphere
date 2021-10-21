import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenGenerator from './ScreenGenerator';

export default function App() {
  var Gen = new ScreenGenerator();

  Gen.generateScreen("Hey nobody change this line or we\'ll get a conflict! >:(");
  
  return Gen.render();
}

