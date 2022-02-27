import React, { Component } from 'react'
import { alterPostScore, pushPostToDatabase } from './firebaseConfig'
import { generatePostID, getUser, setScreen, styles, PAGES,  } from './Utility'
import PostComponent from './PostComponent'

export class Post {
  // Post objects will be constructed from postPage() prompt
  constructor (attachedMiD, postID, mediaContent, textContent, starting_score, interactedUsers, timestamp) {
    // TODO(Gazdecki) Supposedly we need this, but it doesn't work and I don't need it for some reason?
    // this.incrementScore = this.incrementScore.bind(this)
    this.attachedMiD = attachedMiD
    this.postID = postID
    this.mediaContent = mediaContent
    this.textContent = textContent
    this.starting_score = starting_score;
    this.interactedUsers = interactedUsers
    this.timestamp = timestamp
  }

  getAttachedMID () {
    return this.MiD
  }

  getPostID () {
    return this.postID
  }

  incrementScore () {
    this.starting_score++;
    alterPostScore(this.postID, 0.5)
  }

  decrementScore () {
    this.starting_score--;
    alterPostScore(this.postID, -0.5)
  }

  getInteractedUsers () {
    return this.interactedUsers
  }
}

  export async function changeScore(post, change) {
    post.starting_score += change;
    console.log("Upvote button pressed, score is now: " + post.state.score + ".")
    alterPostScore(post.postID, 0.5)
    //This should also add the current user to my interacted users.
  }


export async function savePost (text) {
  console.log('SAVE POST')
  if (text.length > 50) {
    Alert.alert('Post too long',
                'Posts can be, at most, 50 characers.',
                { text: 'OK.' })
                return;
  }
  console.log("Saving post!");
  const u = getUser()
  console.log("Current user:" + u);
  if(u == null) {
    console.log("Current user is null! This is an error state.")
    return;
  }
  const p = new Post(u.MiD, generatePostID(), null, text, 0, [], new Date().toString().substring(0,21))
  u.addPost(p)
  u.storeLocally()
  await pushPostToDatabase(p)
  setScreen(PAGES.VIEWPOSTS)
}

export function renderPost (post) {
  const p = post.item;
  return <PostComponent postObj = {p} />
  if (false) {
  
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
      <Text style={styles.postContainerText}>{p.timestamp} </Text>
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

}