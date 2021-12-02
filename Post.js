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
}

// where it all comes together
// will add const media, const score, const id as created

export async function savePost (text, media) { // call with postText$.get() and postMedia$.get() as the two parameters
  media = null // placeholder for eventual media content
  if (text.length > 50) {
    Alert.alert('Post too long', 'Posts can be, at most, 50 characers.', { text: 'OK.' })
  }
  const p = new Post(generatePostID(), media, text, 0, new Date().toString())
  const u = getUser()
  u.addPost(p)
  u.storeLocally()
  setScreen(PAGES.VIEWPOSTS)
}

export function renderPost (post) {
  const p = post.item
  return (
    <View style={styles.postContainer}>
      <Text style={styles.postContainerText}>Post ID: {p.postID} </Text>
      <Text style={styles.postContainerText}>{p.timestamp} </Text>
      <Text style={styles.postContainerText}>Media content: {p.mediaContent} </Text>
      <Text style={styles.postContainerText}>Text content: {p.textContent} </Text>
      <Text style={styles.postContainerText}>Score: {p.score} </Text>
      <br />
    </View>
  )
} // TO BE FORMATTED
