import React from 'react'
import { View, Text, Alert, TouchableOpacity } from 'react-native'
import { alterPostScore, pushPostToDatabase } from './firebaseConfig'
import { generatePostID, getUser, setScreen, styles, PAGES, getData } from './Utility'

export class Post extends React.Component {
  // Post objects will be constructed from postPage() prompt
  constructor (attachedMiD, postID, mediaContent, textContent, starting_score, timestamp) {
    super()
    this.attachedMiD = attachedMiD
    this.postID = postID
    this.mediaContent = mediaContent
    this.textContent = textContent
    // TODO(Gazdecki) Consider counting each type of vote seperately.
    this.stateOfScore = {
      score:starting_score
    };
    this.timestamp = timestamp
  }
  // TODO(Gazdecki) Determine if we need this? How does this relate to hooks?
  //this.incrementScore=this.incrementScore.bind(this)
  // TODO(Gazdecki) Examen the ScreenGenerator.js's use of a hook.

  getID () {
    return this.postID
  }

  decrementScore () {
    this.score -= 1
    alterPostScore(this.postID, -0.5)
  }

  getAttachedMID() {
    return this.MiD
  }
}  // End of Post Class.
// TODO(Gazdecki) Consider compressing both buttons into a set of one function.

// Must be an external function in order to be hooked correctly.
export async function incrementScore(post) {
  // TODO(Gazdecki) Slowly ad these lines and get each one fully functioning.
  post.stateOfScore={ score:69 }
//  post.setStateOfScore({score : post.stateOfScore.score + 1})
//  alterPostScore(post.postID, 0.5)
  console.log("Upvote button pressed, score is now: ")// + post.StateOfScore:score )
}

// call with postText$.get() and postMedia$.get() as the two parameters
export async function savePost (text) {
  if (text.length > 50) {
    Alert.alert('Post too long',
                'Posts can be, at most, 50 characers.',
                { text: 'OK.' })
  }
  const u = getUser()
  //(attachedMiD, postID, mediaContent, textContent, score, timestamp)
  const new_post = new Post(u.MiD, generatePostID(), null, text, 1,
                            new Date().toString())
  u.addPost(new_post)
  u.storeLocally()
  // TODO(Gazdecki) Make this line work again, I believe I need to mod firebaseConfig.js
  //pushPostToDatabase(new_post)
  setScreen(PAGES.VIEWPOSTS)
}

export function renderPost(post) {
  const p = post.item  // Okay I'll fuckin' bite, what the hell is post.item?
  return (
    <View style={styles.postContainer}>
      <Text style={styles.postContainerText}>MID: {p.attachedMiD} </Text>
      <Text style={styles.postContainerText}>Post ID: {p.postID} </Text>
      <Text style={styles.postContainerText}>{p.timestamp} </Text>
      {/**If no media content, then don't render it lmao. */}
      {(p.mediaContent != null) && <Text style={styles.postContainerText}>
        Media content: {p.mediaContent} </Text>}
      <Text style={styles.postContainerText}>
        Text content: {p.textContent} </Text>
      {/**<Text style={styles.postContainerText}>
        Score: {p.stateOfScore.score} </Text>*/}
      {/**TODO(Gazdecki) Need to pull @Carliegh 's button style she's got down in her beta. */}
      {/**TODO(all) Best way to force 1-person:1-vote on each post? */}
      {/**Upvote Button. */}
      <TouchableOpacity
        style={styles.postBtn} onPress={ () => {incrementScore(post)} }
      >
        <Text style={styles.buttonText}> Upvote </Text>
      </TouchableOpacity>
      {/**Downvote Button. */}
      <Text style={styles.postContainerText}>Score: {p.score} </Text>
    </View>
  )
} // TO BE FORMATTED TODO(Gazdecki)
