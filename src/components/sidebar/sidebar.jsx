import Navbar from '../navbar/navbar'
import Search from '../search/search'
import Chats from '../chats/chats'

import './sidebar.scss'

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Navbar />
      <div className="userSidebar">
        <Search />
        <Chats />
      </div>
    </div>
  )
}

export default Sidebar
