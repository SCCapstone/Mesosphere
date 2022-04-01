import React, { Component } from 'react'
import { ActivityIndicator, Alert, View, Image, TouchableOpacity, Text, FlatList } from 'react-native'
import { styles, getUser, setUser, setScreen, PAGES } from './Utility'
import backBtn from './assets/BackBtn.png'
import { pullNotifications, getDisplayNameFromMID, addPeerToDatabase, removeNotification } from './firebaseConfig'

export default class AccountPageComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      notifs: '...',
      userRealName: null,
      userMiD: null,
      error: null
    }
  }

  componentDidMount () {
    this.fetchNotificationSize()
  }

  async fetchNotificationSize () {
    const u = getUser()
    const nlist = await pullNotifications(getUser())
    this.setState({
      notifs: nlist.length,
      userRealName: u.getDisplayName(),
      userMiD: u.getMiD(),
      loading: false,
      error: 0
    })
  }

  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.bigText}>Welcome back, {this.state.userRealName}</Text>
        <Text style={styles.text}>{this.state.userMiD}</Text>
        <Text style={styles.NotifCountLoc}>{this.state.notifs}</Text>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => {
            setScreen(PAGES.NOTIFICATIONS)
          }}
        >
          <Text style={styles.loginText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => {
            setScreen(PAGES.SETTINGS)
          }}
        >
          <Text style={styles.loginText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => {
            setUser(null)
            setScreen(PAGES.LOGIN)
          }}
        >
          <Text style={styles.loginText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
