import React from 'react' 
import {TouchableOpacity, Button, Text, Image, View, StyleSheet} from 'react-native'
import {storeData, getData, styles, getUser, setScreen, setUser, PAGES} from './Utility'
import {atom} from 'elementos'



// Tasks:
// Posts must consist of plaintext and optional image components
// Users must be able to attach images via a pointer to their phone library
// Posts generate unique IDs after checking with firebase
// Posts have associated score variables
// Post data is to be stored locally

export class Post {
// code here
}

export function postPage() {
  const u = getUser()
  return (
    <>
	  <Text>What is on your mind today, node? </Text>
	  <TouchableOpacity
	    style={styles.postBtn}
	    <Text style={styles.buttonText}> Click to post! </Text>
	    //onPress={() => {
	    //on the button press, they should be able to post
		    //within this post option they have the option to add image
	    
	    }}	  
	  >  
  );
const styles = StyleSheet.create({
  postBtn: {
  	bgndColor: "black",
	padding: 15
	borderRadius: 5,
  },
  buttonText: {
  	fontSize: 17
	color: '#fff',
  }
});
}
export function textContent() {}
export function imageContent() {}
export function videoContent() {}



