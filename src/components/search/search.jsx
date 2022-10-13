import { useContext, useState } from 'react'

import { collection, query, getDocs, doc, updateDoc, serverTimestamp, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { AuthContext } from '../../context/auth-context'
import { ChatContext } from '../../context/chat-context'
import Fries from '../../images/fries.jpg'

import './search.scss'

const Search = () => {
  const [userName, setUserName] = useState('')
  const [user, setUser] = useState(null)
  const [err, setErr] = useState(null)
  const { currentUser } = useContext(AuthContext)

  const handleSearch = async () => {
    if (userName.trim() === '') return
    const q = query(collection(db, 'users'))
    setErr(null)

    try {
      const querySnapshot = await getDocs(q)
      let searchResults = []
      querySnapshot.forEach(doc => {
        if (doc.data().displayName.includes(userName)) {
          searchResults.push(doc.data())
        }
      })
      if (searchResults.length === 0) setErr(true)
      setUser(searchResults)
    } catch (error) {
      setErr(error)
    }
  }

  const handleKey = e => {
    if (e.code === 'Enter') {
      handleSearch()
    }
  }

  const { dispatch } = useContext(ChatContext)
  const handleSelect = async user => {
    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid

    try {
      const res = await getDoc(doc(db, 'chats', combinedId))

      if (!res.exists()) {
        await setDoc(doc(db, 'chats', combinedId), { message: [] })

        await updateDoc(doc(db, 'userChats', currentUser.uid), {
          [combinedId + '.userInfo']: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          [combinedId + '.date']: serverTimestamp()
        })

        await updateDoc(doc(db, 'userChats', user.uid), {
          [combinedId + '.userInfo']: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          },
          [combinedId + '.date']: serverTimestamp()
        })

        dispatch({ type: 'CHANGE_USER', payload: user })
      }
    } catch (error) {}

    setUserName('')
    setUser(null)
  }

  return (
    <div className="search">
      <div className="searchForm">
        <input type="text" placeholder="Find a user" onKeyDown={handleKey} onChange={e => setUserName(e.target.value)} value={userName} />
      </div>
      <div className="searchResult">
        {err && <div className="notFound">User not found!</div>}
        {user &&
          user.map(userInfo => (
            <div className="userChat" onClick={() => handleSelect(userInfo)} key={userInfo.uid}>
              <img
                src={userInfo.photoURL}
                alt=""
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null
                  currentTarget.src = Fries
                }}
              />
              <div className="userChatInfo">
                <span>{userInfo.displayName}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default Search
