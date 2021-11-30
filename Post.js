import React from 'react'
import { TouchableOpacity, Button, Text, TextInput, Image, View, StyleSheet } from 'react-native'
import { generateUniqueMID, generatePostID, storeData, getData, getUser, setScreen, setUser, PAGES } from './Utility'
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
}
// where it all comes together
// will add const media, const score, const id as created

export async function savePost (text, media) { //call with postText$.get() and postMedia$.get() as the two parameters
	media  = null //placeholder for eventual media content
  if (text.length >  50) {
  	alert('Post to long. Please shorten.')
  }
  const u = new Post(generatePostID(), media, text, 0, new Date().toString())
  await storeData(u.postID, u)
  alert('Post stored to local storage!')
  return u
}

export function renderPostByID(postID) {
	//const p = getData(postID) not to be uncommented until merged
	const p = new Post(0, null, "text content", 55, new Date().toString())
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