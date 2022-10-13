import { useContext } from 'react'

import { AuthContext } from '../../context/auth-context'
import { ChatContext } from '../../context/chat-context'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import Fries from '../../images/fries.jpg'

import './navbar.scss'

const Navbar = () => {
  const { currentUser } = useContext(AuthContext)
  const { dispatch } = useContext(ChatContext)

  const handleLogOut = () => {
    dispatch({ type: 'USER_LOG_OUT' })
    signOut(auth)
  }

  return (
    <div className="navbar">
      <span className="logo">Fries Chat</span>
      <div className="user">
        <img
          src={currentUser.photoURL}
          alt=""
          onError={({ currentTarget }) => {
            currentTarget.onerror = null
            currentTarget.src = Fries
          }}
        />
        <span>{currentUser.displayName}</span>
        <button onClick={handleLogOut}>Log Out</button>
      </div>
    </div>
  )
}

export default Navbar
