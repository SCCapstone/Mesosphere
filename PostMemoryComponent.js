import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { alterPostScore, pullAccountFromDatabase, removeInteractions, addUserInteraction, pullPostFromDatabase } from './firebaseConfig'
import { getUser, styles } from './Utility'

import XBtn from './assets/XBtn.png'

export default class PostMemoryComponent extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: true,
      displayname: 'Loading...',
      score: 0,
      error: null,
      deleted: false
    }

    this.postObj = null;
    this.postID = props.postID;
  }

  componentDidMount () {
    this.loadData()
  }

  async loadData () {
    this.setState({ loading: true});
    this.postObj = await pullPostFromDatabase(this.postID);
    this.setState({
      displayname: this.postObj.attachedMiD,
      score: this.postObj.starting_score
    })
    console.log('Pulling info on this poster...')
    const poster = await pullAccountFromDatabase(this.postObj.attachedMiD)
    if (poster == null) {
      console.log('Pulled account was null! This is an error state.')
      return
    }
    this.setState({
      displayname: poster.realName
    })
    this.setState({ loading: false});
  }

  render () {
    if (!this.state.deleted && !this.state.loading) {
      return (
        <View style={{ padding: '2%' }}>
          <View style={styles.postContainer}>
            <TouchableOpacity
              style={styles.XBtnLoc}
              onPress={() => { getUser().removePost(this.postObj); this.setState({ deleted: true }) }}
            >
              <Image source={XBtn} style={styles.backBtn} />
            </TouchableOpacity>
            <Text style={styles.postContainerUsername}>{this.state.displayname} </Text>
            <View style={{
              borderBottomColor: 'black',
              borderBottomWidth: 1
            }}
            />
            <Text style={styles.postContainerText}>{this.postObj.textContent} </Text>
            <Text style={styles.postContainerText}>{this.postObj.timestamp} </Text>
          </View>
        </View>
      )
    } else {
      return (
        <View />
      )
    }
  }
}
