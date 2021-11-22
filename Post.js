import React from 'react' 
import {TouchableOpacity, Button, Text, Image, View, StyleSheet} from 'react-native'
import {storeData, getData, getUser, setScreen, setUser, PAGES} from './Utility'
//import { atom } from 'elementos'



// Tasks:
// Posts must consist of plaintext and optional image components
// Users must be able to attach images via a pointer to their phone library
// Posts generate unique IDs after checking with firebase
// Posts have associated score variables
// Post data is to be stored locally
//
// Also can create a counter type of interaction to incorporate 'score' variable
//
// Current tasks
// Format the screen

export class Post {
 constructor (post) {
 	this.post = post
 }
 getPost() {
 	return this.post
 }
}

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
  }
});
export function textContent() {}
export function imageContent() {}
export function videoContent() {}



