import React, { Component } from 'react'
import { alterPostScore, pullPostFromDatabase, pushPostToDatabase } from './firebaseConfig'
import { generatePostID, getUser, setScreen, styles, PAGES, COLORS } from './Utility'
import PostComponent from './PostComponent'
import PostMemoryComponent from './PostMemoryComponent'

export class Post {
  // Post objects will be constructed from postPage() prompt
  constructor (attachedMiD, postID, mediaContent, textContent, starting_score, interactedUsers, timestamp) {
    this.attachedMiD = attachedMiD
    this.postID = postID
    this.mediaContent = mediaContent
    this.textContent = textContent
    this.starting_score = starting_score
    this.interactedUsers = interactedUsers
    this.timestamp = timestamp
  }

  getAttachedMID () {
    return this.MiD
  }

  getPostID () {
    return this.postID
  }

  incrementScore () {
    this.starting_score++
    alterPostScore(this.postID, 0.5)
  }

  decrementScore () {
    this.starting_score--
    alterPostScore(this.postID, -0.5)
  }

  getInteractedUsers () {
    return this.interactedUsers
  }
}

export async function changeScore (post, change) {
  post.starting_score += change
  console.log('Upvote button pressed, score is now: ' + post.state.score + '.')
  alterPostScore(post.postID, 0.5)
  // This should also add the current user to my interacted users.
}

export async function savePost (text) {
  console.log('SAVE POST')
  if (text.length > 250) {
    Alert.alert('Your post is too long',
      'Posts can be, at most, 250 characers.',
      { text: 'OK.' })
    return
  }
  if (text.length == 0) {
    Alert.alert('Your post is too short',
      'You gotta type at least something!  Just gimme, like, one letter.',
      { text: 'OK.' })
    return
  }
  console.log('Saving post!')
  const u = getUser()
  console.log('Current user:' + u)
  if (u == null) {
    console.log('Current user is null! This is an error state.')
    return
  }
  const p = new Post(u.MiD, generatePostID(), null, text, 0, [], new Date().toString().substring(0, 24))
  u.addPost(p.postID)
  u.storeLocally()
  await pushPostToDatabase(p)
  setScreen(PAGES.VIEWPOSTS)
}

export function renderPost (post) {
  const p = post.item
  return <PostComponent postObj={p} />
}

export function renderPostForMemory (post) {
  return <PostMemoryComponent postID={post} />
}
