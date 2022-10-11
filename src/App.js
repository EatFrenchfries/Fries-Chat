import { useContext } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { AuthContext } from './context/auth-context'

import Home from './pages/home/home'
import Login from './pages/login/login'
import Register from './pages/register/register'

function App() {
  const { currentUser } = useContext(AuthContext)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={!currentUser ? <Login /> : <Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
