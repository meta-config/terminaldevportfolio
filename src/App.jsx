import { LayoutProvider, SplitLayout } from './layout'
import Terminal from './components/Terminal'
import AppContainer from './components/AppContainer'

function App() {
  return (
    <LayoutProvider>
      <SplitLayout
        leftPanel={<Terminal />}
        rightPanel={<AppContainer />}
      />
    </LayoutProvider>
  )
}

export default App
