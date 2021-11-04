import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { PAGES } from './Utility'

export class ScreenGenerator extends Component {
  constructor () {
    super()
    this.page = -1
    this.output = <View style={styles.container}><Text>No screen selected.</Text></View>
  }

  selectScreen (input) {
    this.page = input
    this.generateScreen()
  }

  generateScreen () {
    if (this.page === PAGES.LOGIN) {
      this.output = <View style={styles.container}><Text>Welcome to the login screen.</Text></View>
    }
  }

  render () {
    return this.output
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
