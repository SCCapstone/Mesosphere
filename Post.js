import React, { Component } from 'react'
import { View, Text, Alert, Button } from 'react-native'
import { alterPostScore, pushPostToDatabase } from './firebaseConfig'
import { generatePostID, getUser, setScreen, styles, PAGES,  } from './Utility'

export class Post extends Component {
  // Post objects will be constructed from postPage() prompt
  constructor (attachedMiD, postID, mediaContent, textContent, starting_score, interactedUsers, timestamp) {
    // TODO(Gazdecki) Supposedly we need this, but it doesn't work and I don't need it for some reason?
    // this.incrementScore = this.incrementScore.bind(this)
    super();
    console.log("Creating a new post! Passed in MiD:" + attachedMiD);
    this.attachedMiD = attachedMiD
    this.postID = postID
    this.mediaContent = mediaContent
    this.textContent = textContent
    this.starting_score = starting_score;
    this.interactedUsers = interactedUsers
    this.timestamp = timestamp
    this.state = {
      loading: false,
      displayname: this.attachedMiD,
      score: this.starting_score,
      error: null,
    }
  }

  getAttachedMID () {
    return this.MiD
  }

  getPostID () {
    return this.postID
  }

  incrementScore () {
    this.setState({ 
      score: this.state.score + 1,
    });
    alterPostScore(this.postID, 0.5)
  }

  decrementScore () {
    this.setState({ 
      score: this.state.score - 1,
    });
    alterPostScore(this.postID, -0.5)
  }

  getInteractedUsers () {
    return this.interactedUsers
  }

  componentDidMount () {
    this.loadData()
  }

  async loadData () {
    //Put fetching display name (and potentially score?) here.
  }

  async changeScore(change) {
    this.setState({ 
      score: this.state.score + change,
    });
    console.log("Upvote button pressed, score is now: " + post.state.score + ".")
    alterPostScore(post.postID, 0.5)
    //This should also add the current user to my interacted users.
  }

  render () {
    return (
      <View style={styles.postContainer}>
        <Text style={styles.postContainerUsername}>{this.state.displayname} </Text>
        <View style={{borderBottomColor: 'black',
                      borderBottomWidth: 1,}}/>
        <Text style={styles.postContainerText}>{this.textContent} </Text>
        <Text style={styles.postContainerText}>{this.timestamp} </Text>
        <View style={styles.scoreButtonStyle}>
          <View style={styles.scoreButton}/>
            <Button
                onPress={() => {this.changeScore(1)}}
                title="Like"
                color="#254D32"
                borderRadius='12'
            />
          <View style={styles.spacing}/>
          <View style={styles.scoreButton}/>
            <Button
                onPress={() => {this.changeScore(-1)}}
                title="Dislike"
                color="#3A7D44"
            />
          <View style={styles.spacing}/>
          <Text style={styles.postContainerText}>{this.state.score}</Text>
          <View style={styles.spacing}/>        
        </View>
      </View>
    )
  }
}

export async function savePost (text) {
  if (text.length > 50) {
    Alert.alert('Post too long',
                'Posts can be, at most, 50 characers.',
                { text: 'OK.' })
                return;
  }
  console.log("Saving post!");
  const u = getUser()
  console.log("Current user:" + u);
  const p = new Post(u.MiD, generatePostID(), null, text, 0, [], new Date().toString())
  u.addPost(p)
  u.storeLocally()
  pushPostToDatabase(p)
  setScreen(PAGES.VIEWPOSTS)
}

export function renderPost (post) {
  const p = post.item
  
  //This logic needs to be changed to grab the display name (realName) from the passed in post's MiD)
  /*  About that...
  * In order to pull from the database, this would need to be made ASYNC, which I don't like, considering how we use it
  * in the flatlist.  But then again... this is a *fake* component.  It doesn't use any actual component-like features.
  * It should be refactored to become an actual post component, mirroring Friends and PostsScreen.  After that,
  * I think it could hypothetically pull and await (using similar logic to the other components.)  It's bandaid fixed for now.
  */
  return (
    <View style={styles.postContainer}>
      <Text style={styles.postContainerUsername}>{p.attachedMiD} </Text>
      <View style={{borderBottomColor: 'black',
                    borderBottomWidth: 1,}}/>
      <Text style={styles.postContainerText}>{p.textContent} </Text>
      <Text style={styles.postContainerText}>{new Date().toLocaleString()} </Text>
      <View style={styles.scoreButtonStyle}>
        <View style={styles.scoreButton}/>
          <Button
              onPress={() => {changeScore(p, 1)}}
              title="Like"
              color="#254D32"
              borderRadius='12'
          />
        <View style={styles.spacing}/>
        <View style={styles.scoreButton}/>
          <Button
              onPress={() => {changeScore(p, -1)}}
              title="Dislike"
              color="#3A7D44"
          />
        <View style={styles.spacing}/>
        <Text style={styles.postContainerText}>{p.score}</Text>
        <View style={styles.spacing}/>        
      </View>
    </View>
  )
}