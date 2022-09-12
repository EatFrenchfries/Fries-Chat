import { useContext, useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'

import Message from './message/message'
import { ChatContext } from '../../context/chat-context'
import { db } from '../../firebase'

import './messages.scss'

const Messages = () => {
  const [messages, setMessages] = useState([])
  const { data } = useContext(ChatContext)

  useEffect(() => {
    const getMessages = () => {
      const unsub = onSnapshot(doc(db, 'chats', data.chatId), doc => {
        doc.exists() && setMessages(doc.data().message)
      })

      return () => {
        unsub()
      }
    }

    data.chatId && getMessages()
  }, [data.chatId])

  return <div className="messages">{data.chatId ? messages.map(message => <Message message={message} key={message.id} />) : null}</div>
}

export default Messages
