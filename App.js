import ScreenGenerator from './ScreenGenerator'
import { PAGES, login} from './Utility'

export default function App () {
  const Gen = new ScreenGenerator()
  Gen.selectScreen(PAGES.LOGIN)
  // return;
  return Gen.render()
}
