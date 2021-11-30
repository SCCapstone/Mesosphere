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

  getPost () {
 	return this.post
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

// Screen -- still implementing
export function postPage () {
  return (
    <View>
      <Text style={styles.text}> Time to Post! </Text>
      <Text style={styles.input}> Insert Text Here </Text>
      <TouchableOpacity
        onPress={() => alert('Still being implemented!')}
        style={styles.imageBtn}
      >
        <Text style={styles.buttonText}> Upload Image </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => alert('Still being implemented!')}
        style={styles.postBtn}
      >
        <Text style={styles.buttonText}> Click to post! </Text>
      </TouchableOpacity>
    </View>
  )
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

async function savePost (text, media) { //call with postText$.get() and postMedia$.get() as the two parameters
	media  = null //placeholder for eventual media content
  if (text.length > 100) {
  	alert('Post too long. Please shorten.')
  }
  const u = new Post(generatePostID(), media, text, 0, new Date().toString())
  await storeData(u.postID, u)
  alert('Post stored to local storage!')
  return u
}

export async function renderPostByID(postID) {
	let p = await constructPostFromStorage(postID)
	//const p = new Post(generatePostID(), null, "text content", 55, new Date().toString())
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

async function constructPostFromStorage(postID) {
  const temp = await getData(postID)
  return new Post(temp.postID, temp.mediaContent, temp.textContent, temp.score, temp.timestamp)
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
