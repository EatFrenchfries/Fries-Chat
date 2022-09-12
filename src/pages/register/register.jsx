import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { doc, setDoc } from 'firebase/firestore'

import { auth, storage, db } from '../../firebase'

import addAvatar from '../../images/addAvatar.png'

import './register.scss'

const Register = () => {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [avatarURL, setAvatarURL] = useState('')
  const [avatar, setAvatar] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async e => {
    setLoading(true)
    e.preventDefault()
    const displayName = e.target[0].value
    const email = e.target[1].value
    const password = e.target[2].value
    const file = e.target[3].files[0]

    try {
      setError('')
      const res = await createUserWithEmailAndPassword(auth, email, password)
      const storageRef = ref(storage, displayName)

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async downloadURL => {
          try {
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL
            })
            await setDoc(doc(db, 'users', res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL
            })

            //create empty user chats on firestore
            await setDoc(doc(db, 'userChats', res.user.uid), {})
            navigate('/')
          } catch (error) {
            setError(error)
            setLoading(false)
          }
        })
      })
    } catch (error) {
      let errorMessage
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Please input a valid email address.'
          break
        default:
          errorMessage = 'Something went wrong.'
          break
      }
      setError(errorMessage)
      setLoading(false)
    }
  }

  const handleChange = e => {
    setAvatar(e.target.files[0])
    setAvatarURL(e.target.files[0].name)
  }

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Fries Chat</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="display name" />
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <input style={{ display: 'none' }} type="file" id="file" onChange={handleChange} />
          <label htmlFor="file">
            <img src={avatar === null ? addAvatar : URL.createObjectURL(avatar)} alt="" />
            <span>{avatarURL === '' ? 'Add an avatar' : avatarURL}</span>
          </label>
          <button disabled={loading}>Sign Up</button>
          {loading && <p style={{ color: '#28d149' }}>Uploading and compressing the image please wait...</p>}
        </form>
        <p>
          You do have an account? <Link to="/login">Login</Link>
        </p>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  )
}

export default Register
