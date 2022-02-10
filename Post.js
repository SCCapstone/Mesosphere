import React from 'react'
import { View, Text, Alert } from 'react-native'
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

  incrementScore () {
    this.score += 1
  }

  decrementScore () {
    this.score -= 1
  }
}  // End of Post Class.

// where it all comes together
// will add const media, const score, const id as created

export async function savePost (text, media) { // call with postText$.get() and postMedia$.get() as the two parameters
  if (text.length > 50) {
    Alert.alert('Post too long', 'Posts can be, at most, 50 characers.', { text: 'OK.' })
  }
  // Post(postID, mediaContent, textContent, score, timestamp)
  const new_post = new Post(generatePostID(), null, text, 0, new Date().toString())
  const user = getUser()
  user.addPost(new_post)
  user.storeLocally()
  setScreen(PAGES.VIEWPOSTS)
}
// TODO(Gazdecki) Render vote buttons.
export function renderPost (post) {
  const p = post.item
  // If no media content, then don't render it lmao.
  // TODO(Gazdecki) Compress this code.
  if (p.mediaContent == null) {  //TODO(Gazdecki) Figure out how to comment inside of this return block correctly.
    return (
      <View style={styles.postContainer}>
        <Text style={styles.postContainerText}>Post ID: {p.postID} </Text>
        <Text style={styles.postContainerText}>{p.timestamp} </Text>
        
        <Text style={styles.postContainerText}>Text content: {p.textContent} </Text>
        <Text style={styles.postContainerText}>Score: {p.score} </Text>
      </View>
    )
  } else {
    return (
      <View style={styles.postContainer}>
        <Text style={styles.postContainerText}>Post ID: {p.postID} </Text>
        <Text style={styles.postContainerText}>{p.timestamp} </Text>
        <Text style={styles.postContainerText}>Media content: {p.mediaContent} </Text>
        <Text style={styles.postContainerText}>Text content: {p.textContent} </Text>
        <Text style={styles.postContainerText}>Score: {p.score} </Text>
      </View>
    )
  }
} // TO BE FORMATTED TODO(Gazdecki)
