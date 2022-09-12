import Sidebar from '../../components/sidebar/sidebar'
import Chat from '../../components/chat/chat'

import './home.scss'

const Home = () => {
  return (
    <div className="home">
      <div className="container">
        <Sidebar />
        <Chat />
      </div>
    </div>
  )
}

export default Home
