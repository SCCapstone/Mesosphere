import ScreenGenerator from './ScreenGenerator'
import { PAGES, returnScreen, setScreen } from './Utility'
import { observe } from 'elementos'
import { useState } from 'react'

var oldscreen = -1;

export default function App () {
  const [output, setOutput] = useState();
  const Gen = new ScreenGenerator()
  setScreen(PAGES.LOGIN)

  observe(returnScreen(), (screen) => {
    console.log('Change observed.')
    if(oldscreen != screen) {
      Gen.selectScreen(screen)
      update();
      oldscreen = screen;
    }
    //console.log("Just for fun.")
  })

  function update() {
    console.log('Update has been called!');
    setOutput(Gen.render())
  }

  return output;
}
