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

  getID() {
    return this.postID
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
  const p = new Post(generatePostID(), media, text, 0, new Date().toString())
  u = getUser()
  u.addPost(p)
  u.storeLocally()
  setScreen(PAGES.VIEWPOSTS)
}

export function renderPost(post) {
	const p = post.item;
	return (
		<View>
			<Text>Post ID: {p.postID} </Text>
			<Text>Media content: {p.mediaContent} </Text>
			<Text>Text content: {p.textContent} </Text>
			<Text>Score: {p.score} </Text>
			<Text>Timestamp: {p.timestamp} </Text>
      <View
                style={{
                    height: 1,
                    backgroundColor: '#CED0CE',
                }}
            />
		</View>
	)
} //TO BE FORMATTED