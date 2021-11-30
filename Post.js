import React from 'react'
import { TouchableOpacity, Button, Text, TextInput, Image, View, StyleSheet } from 'react-native'
import { generatePostID, storeData, getData, getUser, setScreen, setUser, PAGES } from './Utility'
import { atom } from 'elementos'

// Tasks:
// Posts must consist of plaintext and optional image components
// Users must be able to attach images via a pointer to their phone library
// Posts generate unique IDs after checking with firebase
// Posts have associated score variables
// Post data is to be stored locally

const postText$ = atom('')
const postMedia$ = atom()

export class Post { // Post objects will be constructed from postPage() prompt
  constructor (postID, mediaContent, textContent, score, timestamp) {
 	this.postID = postID
    this.mediaContent = mediaContent
    this.textContent = textContent
    this.score = score
    this.timestamp = timestamp
  }

  getPost() {
 	return this.post
  }

  getID() {
    return this.postID;
  }

  incrementScore () {
 	this.score += 1
  }

  decrementScore () {
 	this.score -= 1
  }

  getPostID() {
    return this.postID
  }

}

// where it all comes together
// will add const media, const score, const id as created
export function createPostPrompt () {
  return (
    <View>
      <Text style={styles.text}> New Post </Text>
      <TextInput
        style={styles.TextInput}
        placeholder='Insert Text Here'
        placeholderTextColor='Gray'
        onChangeText={(post) => postText$.actions.set(post)}
      />
      <TouchableOpacity style={styles.postBtn}>
        <Text
          style={styles.buttonText}
          onPress={() => alert('Still in development.')}
        >Add media!
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.postBtn} onPress={
			() => { savePost(postText$.get(), postMedia$.get()) }
		}
      >
        <Text style={styles.buttonText}> Click to Post! </Text>
      </TouchableOpacity>
    </View>
  )
}

export async function savePost (text, media) { //call with postText$.get() and postMedia$.get() as the two parameters
	media  = null //placeholder for eventual media content
  if (text.length > 100) {
  	alert('Post too long. Please shorten.')
  }
  const u = new Post(generatePostID(), media, text, 0, new Date().toString())
  await storeData(u.postID, u)
  alert('Post stored to local storage!')
  return u
}

export async function renderPostByID(postID) { //supposed to draw to screen, still working on it
	const p = await constructPostFromStorage(postID)
	//const p = new Post(generatePostID(), null, "text content", 55, new Date().toString()) working test data
  console.log("Post ID: " + p.postID + "\nMedia content: " + p.mediaContent + "\nText content: " 
  + p.textContent + "\nScore: " + p.score + "\nTimestamp: " + p.timestamp)
	return (
		<View>
			<Text>Post ID: {p.postID} </Text>
			<Text>Media content: {p.mediaContent} </Text>
			<Text>Text content: {p.textContent} </Text>
			<Text>Score: {p.score} </Text>
			<Text>Timestamp: {p.timestamp} </Text>
		</View>
	)
} //TO BE FORMATTED

export async function constructPostFromStorage(postID) { //works!
  const temp = await getData(postID)
  console.log("Constructed ID: " + temp.postID)
  let p = new Post(temp.postID, temp.mediaContent, temp.textContent, temp.score, temp.timestamp);
  console.log("Object ID: " + p.getID());
  return p;
  
}


const styles = StyleSheet.create({
  postBtn: {
  	backgroundColor: '#FFA31B',
    height: 50,
    width: '20%',
    marginTop: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageBtn: {
    backgroundColor: '#FFA31B',
  	width: '20%',
    borderRadius: 25,
    height: 50,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
  	color: '#003f5c',
    fontSize: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    marginTop: 8,
    marginBottom: 10,
    height: 120,
    width: '20%',
    borderColor: '#888',
    borderRadius: 30,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  TextInput: {
    color: '#003f5c',
    borderWidth: 2,
    borderRadius: 10,
    height: 120,
    width: '20%',
    alignItems: 'center'

  }
})
