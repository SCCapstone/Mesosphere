import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'

export class ScreenGenerator extends Component {
  constructor () {
    super()
    // output = "None";
  }

  generateScreen (input) {
    this.output = input
  }

  render () {
    return <View style={styles.container}><Text>{this.output}</Text></View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default ScreenGenerator
