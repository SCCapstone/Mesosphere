import React from 'react'
import { View, Text, Alert, TouchableOpacity } from 'react-native'
import { generatePostID, getUser, setScreen, styles, PAGES } from './Utility'

// Tasks:
// Posts must consist of plaintext and optional image components
// Users must be able to attach images via a pointer to their phone library
// Posts generate unique IDs after checking with firebase
// Posts have associated score variables
// Post data is to be stored locally

export class Post { // Post objects will be constructed from postPage() prompt
  constructor (postID, mediaContent, textContent, score, timestamp) {
    this.postID = postID
    this.mediaContent = mediaContent
    this.textContent = textContent
    this.score = score
    this.timestamp = timestamp
  }

  getID () {
    return this.postID
  }
}  // End of Post Class.
// TODO(Gazdecki) Consider compressing both vote buttons into a set of one function.
// TODO(Gazdecki) Understand what the fuck you're doing here?
// In order to live update, this function must be async?
// It really should be inside of the post class.. I just can't seem to call anything in there?
export async function incrementScore (post) {
  // TODO(Gazdecki) Add check for if user has already voted here.
  post.score += 1
  console.log("Upvote button pressed, score is now: " + post.score)
  // TODO(Gazdecki) Console says NaN currently, fix this.
}

export async function DecrementScore (post) {
  // TODO(Gazdecki) Add check for if user has already voted here.
  post.score -= 1
  console.log("Downvote button pressed, score is now: " + post.score)
}
// where it all comes together
// will add const media, const score, const id as created
export async function savePost (text, media) { // call with postText$.get() and postMedia$.get() as the two parameters
  if (text.length > 50) {
    Alert.alert('Post too long', 'Posts can be, at most, 50 characers.', { text: 'OK.' })
  }
  // Post(postID, mediaContent, textContent, score, timestamp)
  const new_post = new Post(generatePostID(), null, text, 1, new Date().toString())
  const user = getUser()
  user.addPost(new_post)
  user.storeLocally()
  setScreen(PAGES.VIEWPOSTS)
}

export function renderPost (post) {
  const p = post.item  // Okay I'll fuckin' bite, what the hell is post.item?
  return (
    <View style={styles.postContainer}>
      <Text style={styles.postContainerText}>Post ID: {p.postID} </Text>
      <Text style={styles.postContainerText}>{p.timestamp} </Text>
      {/**If no media content, then don't render it lmao. */}
      {(p.mediaContent != null) && <Text style={styles.postContainerText}>Media content: {p.mediaContent} </Text>}
      <Text style={styles.postContainerText}>Text content: {p.textContent} </Text>
      <Text style={styles.postContainerText}>Score: {p.score} </Text>
      {/**TODO(Gazdecki) Need to create a {styles.voteBtn} in the corrct place. Side-by-Side visually.*/}
      {/**TODO(all) Best way to force 1-person:1-vote on each post? */}
      {/**Upvote Button. */}
      <TouchableOpacity
        style={styles.postBtn} onPress={
          () => { incrementScore(post) }
        }
      >
        <Text style={styles.buttonText}> Upvote </Text>
      </TouchableOpacity>
      {/**Downvote Button. */}
      <TouchableOpacity
        style={styles.postBtn} onPress={
          () => { decrementScore(post) }
        }
      >
        <Text style={styles.buttonText}> Downvote </Text>
      </TouchableOpacity>
    </View>
  )
} // TO BE FORMATTED TODO(Gazdecki)
