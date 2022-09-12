import Navbar from '../navbar/navbar'
import Search from '../search/search'
import Chats from '../chats/chats'

import './sidebar.scss'

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Navbar />
      <Search />
      <Chats />
    </div>
  )
}

export default Sidebar
