import React from 'react'
import { getInstance } from './ScreenGenerator'
import { returnScreen } from './Utility'
import { observe } from 'elementos'
import { useEffect, useState } from 'react'
//testing below
import { ActivityIndicator, Text } from 'react-native'
import { renderPostByID, createPostPrompt, constructPostFromStorage } from './Post'
import {Post} from './Post'
import { render } from 'react-dom'

let oldscreen = -1

/* packages for this branch: (to uninstall)
 *
 */

export default function App () {
  const [post, setPosts] = useState("default")

  async function viewRenderedPost(postID) {
    console.log("Rendering post!");
    const postRes = await constructPostFromStorage(postID);
    console.log(postRes);
    console.log(post === "default");
    if(post === "default") {
      console.log("Post id:" + postRes.getID());
      setPosts(<Text>{postRes.getID()}</Text>);
    }
  }
  viewRenderedPost('13657f58e628bbf1a17d8c6c60172982ec94312a9e6a9843a29bf494')
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
  if(post === "default")
    return <ActivityIndicator/>;
  else
    return post
}
