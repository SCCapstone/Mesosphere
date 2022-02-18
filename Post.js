import React from 'react'
import { View, Text, Alert, Button } from 'react-native'
import { alterPostScore, pushPostToDatabase } from './firebaseConfig'
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
}

export function incrementScore () {
  this.score += 1
  alterPostScore(this.postID, 0.5)
}

export function decrementScore () {
  this.score -= 1
  alterPostScore(this.postID, -0.5)
}

export async function savePost (text) {
  if (text.length > 50) {
    Alert.alert('Post too long', 'Posts can be, at most, 50 characers.', { text: 'OK.' })
  }
  const u = getUser()
  const p = new Post(u.MiD, generatePostID(), 0, text, new Date().toString())
  u.addPost(p)
  u.storeLocally()
  pushPostToDatabase(p)
  setScreen(PAGES.VIEWPOSTS)
}

export function renderPost (post) {
  const p = post.item
  const u = getUser()
  return (
    <View style={styles.postContainer}>
      <Text style={styles.postContainerUsername}>{u.realName} </Text>
      <View style={{borderBottomColor: 'black',
                    borderBottomWidth: 1,}}/>
      <Text style={styles.postContainerText}>{p.textContent} </Text>
      <Text style={styles.postContainerText}>{new Date().toLocaleString()} </Text>
      <View style={styles.scoreButtonStyle}>
        <View style={styles.scoreButton}/>
          <Button
              onPress={() => alert('Not fully implemented!')}
              title="Like"
              color="#254D32"
              borderRadius='12'
          />
        <View style={styles.spacing}/>
        <View style={styles.scoreButton}/>
          <Button
              onPress={() => alert('not fully implemented yet!')}
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
/*
      savePost(String(postText$.get()), null)      


<Text style={styles.postContainerText}>post_id: {p.postID} </Text>
      onPress={() => p.decrementScore()}
      <Text style={styles.postContainerText}> {p.getUsername}</Text>
            <View style={styles.dislikeScoreButton}>
        <Button
            onPress={() => alert('not fully implemented yet!')}
            title="Dislike"
            color="#000"
            alignItems="right"
            display="flex"
            justifyContent="flex-end"
              paddingHorizontal: 10,
        />
      </View>
      <Text style={styles.postContainerText}> {u.}</Text>
      Modify height to increase space between buttons
*/