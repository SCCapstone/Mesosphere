import React, { Component } from 'react'
import { View, Text, Button } from 'react-native'
import { getUser, styles, COLORS } from './Utility'
import { alterPostScore, pullAccountFromDatabase, removeInteractions, addUserInteraction, hasInteractedWith } from './firebaseConfig'

export default class PostComponent extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: false,
      displayname: 'Loading...',
      score: 0,
      error: null,
      deleted: false
    }

    this.postObj = props.postObj
  }

  componentDidMount () {
    this.loadData()
  }

  async loadData () {
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
  }

  updateScore (change) {
    // Check if this user has already interacted
    for (const entry of [...this.postObj.interactedUsers]) {
      // If they have...
      if (entry.user == getUser().MiD) {
        // If they have already made this interaction
        if ((entry.action == 'like' && change > 0) || (entry.action == 'dislike' && change < 0)) {
          // TODO: Update this code to remove the interaction instead (I think it'll confusing without the buttons changing)
          console.log('This user has already interacted! Removing old interaction...')
          if (entry.action == 'like') {
            console.log('Old score: ' + this.postObj.starting_score)
            alterPostScore(getUser(), this.postObj.postID, -1)
            console.log('About to subtract 1.')
            this.postObj.starting_score += -1
            console.log('New score: ' + this.postObj.starting_score)
            this.setState({
              score: this.postObj.starting_score
            })
          } else {
            console.log('Old score: ' + this.postObj.starting_score)
            alterPostScore(getUser(), this.postObj.postID, 1)
            this.postObj.starting_score += 1
            console.log('New score: ' + this.postObj.starting_score)
            this.setState({
              score: this.postObj.starting_score
            })
          }
          // Remove the interaction locally
          this.postObj.interactedUsers = this.postObj.interactedUsers.filter(
            int => int.user != entry.user
          )
          this.updateFirebaseInteractions()
          return
        } else {
          // Flip the interaction internally
          console.log('Flipping internally...')
          if (entry.action == 'like') { entry.action = 'dislike'; change-- } else { entry.action = 'like'; change++ };
        }
      }
    }
    console.log(JSON.stringify(this.postObj.interactedUsers))
    this.postObj.starting_score += change
    this.setState({
      score: this.postObj.starting_score
    })
    console.log('Upvote button pressed, score is now: ' + this.postObj.starting_score + '. (change:' + change)
    alterPostScore(getUser(), this.postObj.postID, change)
    // Add it locally too, if its' the first interaction
    if (!(JSON.stringify(this.postObj.interactedUsers).includes(getUser().MiD))) {
      console.log('Adding entry locally!')
      let action
      if (change > 0) { action = 'like' } else { action = 'dislike' };
      function interactionFormat () {
        this.user = getUser().MiD,
        this.action = action
      }
      const currentInteraction = new interactionFormat()
      this.postObj.interactedUsers.push(currentInteraction)
    }
    // TODO: Move store firebase options to here (since our local copy is always correct)
    this.updateFirebaseInteractions()
  }

  // Update firebase to match our local copy
  async updateFirebaseInteractions () {
    // Remove all old interactions
    await removeInteractions(getUser(), this.postObj.postID)
    // Check if this user has an end-result-interaction
    for (const entry of [...this.postObj.interactedUsers]) {
      // If they do, add it to firebase
      if (entry.user == getUser().MiD) {
        console.log('Adding new interaction!')
        if (entry.action == 'like') { addUserInteraction(getUser(), this.postObj.postID, 1) } else {
          addUserInteraction(getUser(), this.postObj.postID, -1)
        }
        return
      }
    }
    // If this user has no end-result-interactions, do nothing!
  }

  isMine() {
    if(this.postObj.attachedMiD == getUser().MiD) {
      return(<Button
        onPress={() => {  getUser().removePost(this.postObj); this.setState({ deleted: true }) }}
        title='Delete'
        color={COLORS.DELETE_BUTTON}
      />)
    } else {
      return (<View/>)
    }
  }

  // TODO Make the like and dislike buttons style pieces.
  render () {
    if(this.state.deleted)
      return <View/>
    else 
      return (
      <View style={styles.postContainer}>
        <Text style={styles.postContainerUsername}>{this.state.displayname} </Text>
        <View style={{
          borderBottomColor: 'black',
          borderBottomWidth: 1
        }}
        />
        <Text style={styles.postContainerText}>{this.postObj.textContent} </Text>
        <Text style={styles.postContainerText}>{this.postObj.timestamp} </Text>
        <View style={styles.scoreButtonStyle}>
          <View style={styles.scoreButton} />
          <Button
            onPress={() => { this.updateScore(1) }}
            title='Like'
            color={COLORS.LIKE_BUTTON}
            borderRadius='12'
          />
          <View style={styles.spacing} />
          <View style={styles.scoreButton} />
          <Button
            onPress={() => { this.updateScore(-1) }}
            title='Dislike'
            color={COLORS.DISLIKE_BUTTON}
          />
          <View style={styles.spacing} />
          <Text style={styles.postContainerText}>{this.state.score}</Text>
          <View style={styles.bigSpacing} />
          {this.isMine()}
          <View style={styles.spacing} />
        </View>
      </View>
    )
  }
}
