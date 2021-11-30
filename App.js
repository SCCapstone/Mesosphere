import React from 'react'
import { getInstance } from './ScreenGenerator'
import { returnScreen } from './Utility'
import { observe } from 'elementos'
import { useEffect, useState } from 'react'
//testing below
import { ActivityIndicator } from 'react-native'
import { renderPostByID, createPostPrompt, constructPostFromStorage } from './Post'
import { render } from 'react-dom'

let oldscreen = -1

/* packages for this branch: (to uninstall)
 *
 */

export default function App () {

  /*const [output, setOutput] = useState()
  const Gen = getInstance()

  observe(returnScreen(), (screen) => {
    console.log('Change observed.')
    if (oldscreen !== screen) {
      Gen.selectScreen(screen)
      update()
      oldscreen = screen
    } else {
      console.log('Not moving because old screen is ' + oldscreen + ' and new screen is ' + screen)
    }
  })

  function update () {
    console.log('Update has been called!')
    setOutput(Gen.render())
  }

  return output*/
  
  //testing code
  const [post, setPosts] = useState(<ActivityIndicator/>)
  const viewRenderedPost = (postID) => {
    constructPostFromStorage(postID)
    .then(res => {
      setPosts(res.data)
    });
    return (
      <Text>{post.postID}</Text>
    )
  }
  return (
    //createPostPrompt()
    new viewRenderedPost("34c37471dd2693a869094e145444c61cb4f606a23bfcb8f1b5cdde2d")
  )
}
