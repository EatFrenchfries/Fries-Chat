import { useContext, useEffect, useRef } from 'react'

import { AuthContext } from '../../../context/auth-context'
import { ChatContext } from '../../../context/chat-context'

import './message.scss'

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext)
  const { data } = useContext(ChatContext)

  const hour = message.date.toDate().getHours()
  const min = message.date.toDate().getMinutes()

  const ref = useRef()

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }, [message])

  return (
    <div ref={ref} className={`message ${message.senderId === currentUser.uid && 'owner'}`}>
      <div className="messageInfo">
        <img src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt="" />
        <span>{`${hour > 9 ? hour : '0' + hour} : ${min > 9 ? min : '0' + min}`}</span>
      </div>
      <div className="messageContent">
        {message.text && <p>{message.text}</p>}
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  )
}

export default Message
