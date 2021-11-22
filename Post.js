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
	  <Text>What is on your mind today, node? </Text>
	  <TouchableOpacity onPress={() => alert('Still being implemented!')} 
	  	style={styles.postBtn} >
	    <Text style={styles.buttonText}> Click to post! </Text>
	  
	    </TouchableOpacity>
	  </View>
  )
}
/*export function postScreen() {
  return(
  	<View>
	<TextInput style={styles.}>



	</View>
  )

}
*/
const styles = StyleSheet.create({
  postBtn: {
  	backgroundColor: "black",
	padding: 15,
	borderRadius: 5,
	alignItems: 'center'
  },
  buttonText: {
  	fontSize: 20,
	color: '#003f5c',
  },
  text: {
  	color: '#003f5c',
	fontSize: 15
  }
});
export function textContent() {}
export function imageContent() {}
export function videoContent() {}



