import React from 'react'
import { View, Text, Alert, TouchableOpacity } from 'react-native'
import { alterPostScore, pushPostToDatabase } from './firebaseConfig'
import { generatePostID, getUser, setScreen, styles, PAGES, getData } from './Utility'

export class Post extends React.Component {
  // Post objects will be constructed from postPage() prompt
  constructor (attachedMiD, postID, mediaContent, textContent, starting_score, timestamp) {
    super()
    // TODO(Gazdecki) Supposedly we need this, but it doesn't work and I don't need it for suome reason?
    // this.incrementScore = this.incrementScore.bind(this)
    this.attachedMiD = attachedMiD
    this.postID = postID
    this.mediaContent = mediaContent
    this.textContent = textContent
    // TODO(Gazdecki) Consider counting each type of vote seperately.
    this.stateOfScore = { score:starting_score };
    this.timestamp = timestamp
  }
}  // End of Post Class.
// TODO(Gazdecki) Consider compressing both buttons into a set of one function.

// Must be an external function in order to be hooked correctly.
// Must be async inorder to rerender.
export async function changeScore(post, change) {
  post.stateOfScore = { score:(post.stateOfScore.score + change) }
  // TODO(Gazdecki) Why doesn't this work?:
  /*
  state = post.item.stateOfScore;
  state = { score:(state.score + 1) }
  */
  console.log("Upvote button pressed, score is now: " + post.stateOfScore.score + ".")
  alterPostScore(post.postID, 0.5)
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
  pushPostToDatabase(new_post)
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
      <Text style={styles.postContainerText}>
        Score: {p.stateOfScore.score} </Text>
      {/**TODO(Gazdecki) Need to pull @Carliegh 's button style she's got down in her beta. */}
      {/**TODO(all) Best way to force 1-person:1-vote on each post? */}
      {/**Upvote Button. */}
      <TouchableOpacity
        style={styles.postBtn} onPress={ () => {changeScore(p, 1)} }
      >
        <Text style={styles.buttonText}> Upvote </Text>
      </TouchableOpacity>
      {/**Downvote Button. */}
      <TouchableOpacity
        style={styles.postBtn} onPress={ () => {changeScore(p, -1)} }
      >
        <Text style={styles.buttonText}> Downvote </Text>
      </TouchableOpacity>
    </View>
  )
} // TO BE FORMATTED TODO(Gazdecki)
