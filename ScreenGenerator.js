import React from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import { PAGES, styles, setScreen, initP2P } from './Utility'
import { loginScreen, newUserPrompt, accountPage, makeAdminAcc } from './User'
import logo from './assets/MesoSphere.png'

export class ScreenGenerator {
  constructor () {
    this.page = -1
    this.output = (<View style={styles.container}><Text>No screen selected.</Text></View>)
    makeAdminAcc()
    setScreen(PAGES.LOGIN)
    initP2P();
  }

  selectScreen (input) {
    this.page = input
    this.generateScreen()
  }

  generateScreen () {
    console.log('Generating: ' + this.page)
    if (this.page === PAGES.LOGIN) {
      this.output = (
        <View style={styles.container}>
          <Image source={logo} style={styles.logo} />
          {loginScreen()}
        </View>
      )
    } else if (this.page === PAGES.MAKEACC) {
      this.output = (<View style={styles.container}>{newUserPrompt()}</View>)
    } else if (this.page === PAGES.ACCOUNTPAGE) {
      this.output = (
      <View style={styles.container}>
        {accountPage()}
        {this.generateBottomBar(1)}
      </View>
      )
    }
  }

  generateBottomBar(currentSlice) {
    if(currentSlice == 1) {
      return(
        <View style={styles.bottomButtomBar}>
          <TouchableOpacity style={styles.userButtonSelected}>
            <Image source={logo} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.networkButton}>
            <Image source={logo} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>Network</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.friendButton}>
            <Image source={logo} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.postButton}>
            <Image source={logo} style={styles.bottomButtonIcon} />
            <Text style={styles.bottomButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  render () {
    return this.output
  }
}

let instance

export function getInstance () {
  if (instance == null) {
    instance = new ScreenGenerator()
    console.log('New SG generated.')
  }
  return instance
}

export default ScreenGenerator
