import React from 'react'
import { View, Text, Alert, Button } from 'react-native'
import { alterPostScore, pushPostToDatabase } from './firebaseConfig'
import { generatePostID, getUser, setScreen, styles, PAGES, getData } from './Utility'

export class Post extends React.Component {
  // Post objects will be constructed from postPage() prompt
  constructor (attachedMiD, postID, mediaContent, textContent, starting_score, timestamp, interactedUsers) {
    super()
    // TODO(Gazdecki) Supposedly we need this, but it doesn't work and I don't need it for some reason?
    // this.incrementScore = this.incrementScore.bind(this)
    this.attachedMiD = attachedMiD
    this.postID = postID
    this.mediaContent = mediaContent
    this.textContent = textContent
    this.stateOfScore = { score:starting_score };
    this.timestamp = timestamp
    this.interactedUsers = interactedUsers
  }
}  // End of Post Class.
// Must be an external function in order to be hooked correctly.
// Must be async inorder to rerender.
export async function changeScore(post, change) {
  post.stateOfScore = { score:(post.stateOfScore.score + change) }
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
  const new_post = new Post(u.MiD, generatePostID(), null, text, 1,
                            new Date().toString())
  u.addPost(new_post)
  u.storeLocally()
  pushPostToDatabase(new_post)
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
        <Text style={styles.postContainerText}>{p.stateOfScore.score}</Text>
        <View style={styles.spacing}/>        
      </View>
    </View>
  )
}

