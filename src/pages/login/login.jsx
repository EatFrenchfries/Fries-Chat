import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'

import { auth } from '../../firebase'

const Login = () => {
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    const email = e.target[0].value
    const password = e.target[1].value

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/')
    } catch (error) {
      let errorMessage
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Please input a valid email address.'
          break
        default:
          errorMessage = 'Something went wrong.'
          break
      }
      setError(errorMessage)
    }
  }
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Fries Chat</span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <button>Sign In</button>
        </form>
        <p>
          You don't have an account? <Link to="/register">Register</Link>
        </p>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  )
}

export default Login
