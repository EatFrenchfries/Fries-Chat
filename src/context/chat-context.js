import { createContext, useContext, useReducer, useState } from 'react'
import { AuthContext } from './auth-context'

const INITIAL_STATE = {
  chatId: '',
  user: {}
}
export const ChatContext = createContext(INITIAL_STATE)

export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext)
  const [isOpen, setIsOpen] = useState(true)

  const chatReducer = (state, action) => {
    switch (action.type) {
      case 'CHANGE_USER':
        return {
          user: action.payload,
          chatId: currentUser.uid > action.payload.uid ? currentUser.uid + action.payload.uid : action.payload.uid + currentUser.uid
        }
      case 'USER_LOG_OUT':
        return {
          user: {},
          chatId: ''
        }
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE)

  return <ChatContext.Provider value={{ isOpen, setIsOpen, data: state, dispatch }}>{children}</ChatContext.Provider>
}
