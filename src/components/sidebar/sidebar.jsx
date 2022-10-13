import { useContext } from 'react'

import Navbar from '../navbar/navbar'
import Search from '../search/search'
import Chats from '../chats/chats'
import { ChatContext } from '../../context/chat-context'

import './sidebar.scss'

const Sidebar = () => {
  const { isOpen } = useContext(ChatContext)

  return (
    <div className={isOpen ? 'sidebar' : 'close'}>
      <Navbar />
      <div className="userSidebar">
        <Search />
        <Chats />
      </div>
    </div>
  )
}

export default Sidebar
