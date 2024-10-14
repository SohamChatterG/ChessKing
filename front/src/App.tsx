import { useState } from 'react'
import Landing from './screens/Landing'
import Signin from './screens/Signin'
import Signup from './screens/Signup'
import Game from './screens/Game'
import { BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />}/>
          <Route path='/signin'element={<Signin />}/>
          <Route path='/landing' element={<Landing />}/>
          <Route path="/game" element={<Game />}/>
        </Routes>
      </BrowserRouter>

    
      
  )
}

export default App
