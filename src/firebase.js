import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyC7-ItgtjgvNCtLsqKhIrAXdBAIsm1z7Ag',
  authDomain: 'chat-app-da131.firebaseapp.com',
  projectId: 'chat-app-da131',
  storageBucket: 'chat-app-da131.appspot.com',
  messagingSenderId: '818033372518',
  appId: '1:818033372518:web:7b05766aee4403edcd2ca7'
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = getAuth()
export const storage = getStorage()
export const db = getFirestore()
