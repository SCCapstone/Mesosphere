import React, { Component } from 'react'
import { alterPostScore, pullPostFromDatabase, pushPostToDatabase } from './firebaseConfig'
import { generatePostID, getUser, setScreen, styles, PAGES, COLORS } from './Utility'
import PostComponent from './PostComponent'
import PostMemoryComponent from './PostMemoryComponent'

export class Post {
  // Post objects will be constructed from postPage() prompt
  constructor (attachedMiD, postID, mediaContent, textContent, starting_score, interactedUsers, timestamp) {
    // TODO(Gazdecki) Supposedly we need this, but it doesn't work and I don't need it for some reason?
    // this.incrementScore = this.incrementScore.bind(this)
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
  if (text.length > 50) {
    Alert.alert('Post too long',
      'Posts can be, at most, 50 characers.',
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
  const p = new Post(u.MiD, generatePostID(), null, text, 0, [], new Date().toString().substring(0, 21))
  u.addPost(p.postID);
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
