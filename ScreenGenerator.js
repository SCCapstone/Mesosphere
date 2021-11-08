import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'
import { PAGES, styles, getScreen, returnScreen, currScreen$ } from './Utility'
import { loginScreen, newUserPrompt, accountPage } from './User'
import { atom, observe } from 'elementos'
import logo from './assets/MesoSphere.png'


export class ScreenGenerator extends Component {
  constructor () {
    super()
    this.page = -1
    this.output = (<View style={styles.container}><Text>No screen selected.</Text></View>)
  }

  selectScreen (input) {
    this.page = input
    this.generateScreen()
  }

  generateScreen () {
    console.log("Generating: " + this.page)
    if (this.page === PAGES.LOGIN) {
      this.output = (
        <View style={styles.container}>
          <Image source={logo} style={styles.logo} />
          {loginScreen()}
        </View>)
    } else if (this.page === PAGES.MAKEACC) {
        this.output = (<View style={styles.container}>{newUserPrompt()}</View>)
        
    } else if (this.page === PAGES.ACCOUNTPAGE) {
        this.output = (<View style={styles.container}>{accountPage()}</View>)
    }
  }

  render () {
    return this.output
  }
}

export default ScreenGenerator
