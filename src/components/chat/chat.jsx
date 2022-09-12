import { useContext } from 'react'

import Messages from '../messages/messages'
import Input from '../input/input'
import Cam from '../../images/cam.png'
import Add from '../../images/add.png'
import More from '../../images/more.png'
import { ChatContext } from '../../context/chat-context'

import './chat.scss'

const Chat = () => {
  const { data } = useContext(ChatContext)

  return (
    <div className="chat">
      <div className="chatInfo">
        <div className="chatUser">
          {data.user?.photoURL && <img src={data.user?.photoURL} alt="" />}
          {data.user?.displayName && <span>{data.user?.displayName}</span>}
        </div>
        <div className="chatIcons">
          <img src={Cam} alt="" />
          <img src={Add} alt="" />
          <img src={More} alt="" />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  )
}

export default Chat
