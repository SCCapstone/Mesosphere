import React from 'react'
import { Text, View, Image } from 'react-native'
import { PAGES, styles, setScreen, } from './Utility'
import { loginScreen, newUserPrompt, accountPage, makeAdminAcc } from './User'
import logo from './assets/MesoSphere.png'

export class ScreenGenerator{
  constructor () {
    this.page = -1
    this.output = (<View style={styles.container}><Text>No screen selected.</Text></View>)
    makeAdminAcc()
    setScreen(PAGES.LOGIN)
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
      this.output = (<View style={styles.container}>{accountPage()}</View>)
    }
  }

  render () {
    return this.output
  }
}

var instance

export function getInstance() {
    if(instance == null) {
        instance = new ScreenGenerator()
        console.log("New SG generated.")
    }
    return instance;
}

export default ScreenGenerator
