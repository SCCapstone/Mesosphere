import React from 'react' 
import {TouchableOpacity, Button, Text, TextInput, Image, View, StyleSheet} from 'react-native'
import {storeData, getData, getUser, setScreen, setUser, PAGES} from './Utility'
import { atom } from 'elementos'



// Tasks:
// Posts must consist of plaintext and optional image components
// Users must be able to attach images via a pointer to their phone library
// Posts generate unique IDs after checking with firebase
// Posts have associated score variables
// Post data is to be stored locally

export class Post { //Post objects will be constructed from postPage() prompt
 constructor (postID, mediaContent, textContent, score, MID) {
 	this.postID = postID
	this.mediaContent = mediaContent
	this.textContent = textContent
	this.score = score
	this.MID = MID
 }
 getPost() {
 	return this.post
 }
}

export function incrementScore() {
	this.score += 1
}

export function decrementScore() {
	this.score -= 1
}

// Screen -- still implementing
export function postPage() {
  //const u = getUser()
  return (
	  <View>
	  <Text style={styles.text}> Time to Post! </Text>
	  <Text style={styles.input}> Insert Text Here </Text>
	  <TouchableOpacity onPress={() => alert('Still being implemented!')}
	  	style={styles.imageBtn}>
	    <Text style={styles.buttonText}> Upload Image </Text>
	    </TouchableOpacity>
	  <TouchableOpacity onPress={() => alert('Still being implemented!')} 
	  	style={styles.postBtn} >
	    <Text style={styles.buttonText}> Click to post! </Text>
	  
	    </TouchableOpacity>
	  </View>
  )
}
// where it all comes together
// will add const media, const score, const id as created
/*export function createPost() {
  const post$ = atom('')
  return(
    <View>
    <Text style = {styles.text}> Create your post </Text>
	<TouchableOpacity onPress{() => textContent(String(post$.get()))}
	  style = {styles.postBtn}> 
	</TouchableOpacity>
    </View>
  )

}
*/
export function postID() {
// posts generate unique IDs after checking with Firebase
}
export function mediaContent() {}
// will likely need to remove initial text later.
export function textContent() {
  const post$ = atom('')
  return (
    <View>
    <Text style ={styles.text}> New Post </Text>
    <TextInput style={styles.TextInput}
       placeholder='Insert Text Here'
       placeholderTextColor='gray' 
       onChangeText={(post) => post$.actions.set(post)}
      />	  	  
    </View>
  )
}

const styles = StyleSheet.create({
  postBtn: {
  	backgroundColor: "#FFA31B",
	height: 50,
	width: '20%',
	marginTop: 40,
	borderRadius: 25,
	justifyContent: 'center',
	alignItems: 'center'
  },
  imageBtn: {
	backgroundColor: "#FFA31B",
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
	color: 'white',
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
	borderColor: "#888",
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
});
//export function textContent() {}
//export function imageContent() {}
//export function videoContent() {}


