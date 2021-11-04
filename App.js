import ScreenGenerator from './ScreenGenerator'

export default function App () {
  const Gen = new ScreenGenerator()
  Gen.generateScreen('I changed this line?')
  // return;
  return Gen.render()
}
