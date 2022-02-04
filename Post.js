import React from 'react'
import { View, Text, Alert, TouchableOpacity} from 'react-native'
import { generatePostID, getUser, setScreen, styles, PAGES } from './Utility'

// Tasks:
// Posts must consist of plaintext and optional image components
// Users must be able to attach images via a pointer to their phone library
// Posts generate unique IDs after checking with firebase
// Posts have associated score variables
// Post data is to be stored locally

export class Post { // Post objects will be constructed from postPage() prompt
  constructor (postID, textContent, score, timestamp) {
    this.postID = postID
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

export async function savePost (text, media) { // call with postText$.get() and postMedia$.get() as the two parameters
  media = null // placeholder for eventual media content
  if (text.length > 50) {
    Alert.alert('Post too long', 'Posts can be, at most, 50 characers.', { text: 'OK.' })
  }
  const p = new Post(generatePostID(), text, 0, new Date().toLocaleString())
  const u = getUser()
  u.addPost(p)
  u.storeLocally()
  setScreen(PAGES.VIEWPOSTS)

}

// When rendering post, we want to display just the items contained, i.e: text + timestamp
// Want to create a more aesthetically pleasing post & timestamp & interactive score button with counter

export function renderPost (post) {
  const p = post.item
  return (
    <View style={styles.postContainer}>
      <Text style={styles.postContainerText}>{p.textContent} </Text>
      <Text style={styles.postContainerText}>{p.timestamp} </Text>
      <Text style={styles.postContainerText}>Post ID: {p.postID} </Text>
      <TouchableOpacity>
        style={styles.DeleteButton} onPress={
          () => alert('Still in development!')
        } <Text style={styles.buttonText}> Delete Post? </Text>
      </TouchableOpacity>
    </View>
  )
} // TO BE FORMATTED

// Render a delete option for the posts feed

/*
<TouchableOpacity
          onPress={"heart this?"} style={styling.Button}>
      </TouchableOpacity>
      

*/
// Old content
// <Text style={styles.postContainerText}>Media content: {p.mediaContent} </Text>
//<Text style={styles.postContainerText}>Score: {p.score} </Text>
//      if(p.getMediaContent() != null){
// <Text style={styles.postContainerText}>Media content: {p.mediaContent}</Text>
/*
  


*/