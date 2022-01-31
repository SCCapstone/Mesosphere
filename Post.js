import React from 'react'
import { View, Text, Alert } from 'react-native'
import { pushPostToDatabase } from './firebaseConfig'
import { generatePostID, getUser, setScreen, styles, PAGES, getData } from './Utility'

// Tasks:
// Posts must consist of plaintext and optional image components
// Users must be able to attach images via a pointer to their phone library
// Posts generate unique IDs after checking with firebase
// Posts have associated score variables
// Post data is to be stored locally

export class Post { // Post objects will be constructed from postPage() prompt
  constructor (attachedMiD, postID, score, textContent, timestamp) {
    this.attachedMiD = attachedMiD
    this.postID = postID
    this.score = score
    this.textContent = textContent
    this.timestamp = timestamp
  }

  getAttachedMID() {
    return this.MiD
  }

  getPostID () {
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

export async function savePost (text) { // call with postText$.get()
  if (text.length > 50) {
    Alert.alert('Post too long', 'Posts can be, at most, 50 characers.', { text: 'OK.' })
  }
  const u = getUser()
  const p = new Post(u.MiD, generatePostID(), 0, text, new Date().toString())
  u.addPost(p)
  //u.storeLocally()
  pushPostToDatabase(p)
  setScreen(PAGES.VIEWPOSTS)
}

export function renderPost (post) {
  const p = post.item
  return (
    <View style={styles.postContainer}>
      {/* <Text style={styles.postContainerText}>MID: {p.attachedMiD} </Text> */}
      <Text style={styles.postContainerText}>Post ID: {p.postID} </Text>
      <Text style={styles.postContainerText}>{p.timestamp} </Text>
      <Text style={styles.postContainerText}>Text content: {p.textContent} </Text>
      <Text style={styles.postContainerText}>Score: {p.score} </Text>
    </View>
  )
} // TO BE FORMATTED
