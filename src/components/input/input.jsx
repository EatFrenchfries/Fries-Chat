import { useContext, useState } from 'react'
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { db, storage } from '../../firebase'
import { v4 as uuid } from 'uuid'

import { AuthContext } from '../../context/auth-context'
import { ChatContext } from '../../context/chat-context'

import Img from '../../images/img.png'
import Attach from '../../images/attach.png'

import './input.scss'

const Input = () => {
  const [text, setText] = useState('')

  const { currentUser } = useContext(AuthContext)
  const { data } = useContext(ChatContext)

  const handleSend = async () => {
    await updateDoc(doc(db, 'chats', data.chatId), {
      message: arrayUnion({
        id: uuid(),
        text,
        senderId: currentUser.uid,
        date: Timestamp.now()
      })
    })

    await updateDoc(doc(db, 'userChats', currentUser.uid), {
      [data.chatId + '.lastMessage']: {
        text
      },
      [data.chatId + '.date']: serverTimestamp()
    })

    await updateDoc(doc(db, 'userChats', data.user.uid), {
      [data.chatId + '.lastMessage']: {
        text
      },
      [data.chatId + '.date']: serverTimestamp()
    })

    setText('')
  }

  const handleChange = async e => {
    const storageRef = ref(storage, 'images/' + e.name)
    const uploadTask = uploadBytesResumable(storageRef, e)

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      'state_changed',
      snapshot => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log('Upload is ' + progress + '% done')
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused')
            break
          case 'running':
            console.log('Upload is running')
            break
          default:
            break
        }
      },
      error => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break
          case 'storage/canceled':
            // User canceled the upload
            break

          // ...

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break
          default:
            break
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then(async downloadURL => {
          console.log('File available at', downloadURL)
          await updateDoc(doc(db, 'chats', data.chatId), {
            message: arrayUnion({
              id: uuid(),
              senderId: currentUser.uid,
              date: Timestamp.now(),
              img: downloadURL
            })
          })
        })
      }
    )

    await updateDoc(doc(db, 'userChats', currentUser.uid), {
      [data.chatId + '.lastMessage']: {
        text: 'Send a image.'
      },
      [data.chatId + '.date']: serverTimestamp()
    })

    await updateDoc(doc(db, 'userChats', data.user.uid), {
      [data.chatId + '.lastMessage']: {
        text: 'Send a image.'
      },
      [data.chatId + '.date']: serverTimestamp()
    })
  }

  return (
    <div className="input">
      <textarea
        placeholder="Type Something..."
        onChange={e => {
          setText(e.target.value)
        }}
        value={text}
      />
      <div className="send">
        <img src={Attach} alt="" />
        <input type="file" style={{ display: 'none' }} id="file" onChange={e => handleChange(e.target.files[0])} />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default Input
