import { useContext, useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'

import { db } from '../../firebase'
import { AuthContext } from '../../context/auth-context'
import { ChatContext } from '../../context/chat-context'
import Fries from '../../images/fries.jpg'

const Chats = () => {
  const [chats, setChats] = useState([])

  const { currentUser } = useContext(AuthContext)
  const { dispatch, setIsOpen } = useContext(ChatContext)

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, 'userChats', currentUser.uid), doc => {
        setChats(doc.data())
      })

      return () => {
        unsub()
      }
    }

    currentUser.uid && getChats()
  }, [currentUser.uid])

  const handleSelect = userInfo => {
    setIsOpen(false)
    dispatch({ type: 'CHANGE_USER', payload: userInfo })
  }

  return (
    <div className="chats">
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map(chat => (
          <div className="userChat" key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>
            <img
              src={chat[1].userInfo.photoURL}
              alt=""
              onError={({ currentTarget }) => {
                currentTarget.onerror = null
                currentTarget.src = Fries
              }}
            />
            <div className="userChatInfo">
              <span>{chat[1].userInfo.displayName}</span>
              <p>{chat[1].lastMessage?.text}</p>
            </div>
          </div>
        ))}
    </div>
  )
}

export default Chats
