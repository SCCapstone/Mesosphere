import { getInstance } from './ScreenGenerator'
import { returnScreen } from './Utility'
import { observe } from 'elementos'
import { useState } from 'react'
//import { pullPostFromDataBase, pullAccountFromDatabase } from './firebaseConfig'

let oldscreen = -1

/* packages for this branch: (to uninstall)
 *
 *
 *
 */


export default function App () {
  const [output, setOutput] = useState()
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

  return output
}
