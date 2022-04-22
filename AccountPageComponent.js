import React, { Component } from 'react'
import { ActivityIndicator, Alert, View, Image, TouchableOpacity, Text, FlatList } from 'react-native'
import { styles, getUser, setUser, setScreen, PAGES, removeValue } from './Utility'
import backBtn from './assets/BackBtn.png'
import { pullNotifications, getDisplayNameFromMID, addPeerToDatabase, removeNotification } from './firebaseConfig'

export default class AccountPageComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      notifs: '...',
      userRealName: null,
      userMiD: null,
      error: null
    }
  }

  componentDidMount () {
    this.fetchInfo()
  }

  async fetchInfo () {
    console.log("Fetching user info...");
    const u = getUser()
    console.log("Account\User:" + u.MiD)
    const nlist = await pullNotifications(getUser())
    console.log("Past await!  Evaluating nlist...");
    if(nlist == null) {
      console.log("Failed to fetch notifications.  Setting to 0...");
      this.setState({
        notifs: 0,
        userRealName: u.realName,
        userMiD: u.MiD,
        loading: false,
        error: 1
      })
    } else {
      this.setState({
        notifs: nlist.length,
        userRealName: u.realName,
        userMiD: u.MiD,
        loading: false,
        error: 0
      })
    }
  }

  render () {
    if(this.state.loading) {
      return <ActivityIndicator size="large" color="#0000ff" />
    }
    return (
      <View style={styles.container}>
        <Text style={styles.bigText}>Welcome back, {this.state.userRealName}</Text>
        <Text style={styles.text} testID='AccountMiD'>{this.state.userMiD}</Text>
        <View style={{width: '100%', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
          <Text style={styles.NotifCountLoc}>{this.state.notifs}</Text>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => {
              setScreen(PAGES.NOTIFICATIONS)
            }}
            testID='NotificationsButton'
          >
            <Text style={styles.loginText}>Notifications</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => {
            setScreen(PAGES.SETTINGS)
          }}
          testID='SettingsButton'
        >
          <Text style={styles.loginText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => {
            removeValue('lastRememberedUser')
            setUser(null)
            setScreen(PAGES.LOGIN)
          }}
          testID='LogoutButton'
        >
          <Text style={styles.loginText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
