import { createContext, useContext } from 'react'

import { initializeApp } from 'firebase/app'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { getDatabase, set, ref } from 'firebase/database'

const firebaseConfig = {
    apiKey: `${process.env.REACT_APP_API_KEY}`,
    authDomain: `${process.env.REACT_APP_AUTH_DOMAIN}`,
    projectId: `${process.env.REACT_APP_PROJECT_ID}`,
    storageBucket: `${process.env.REACT_APP_STORAGE_BUCKET}`,
    messagingSenderId: `${process.env.REACT_APP_MESSAGING_SENDER_ID}`,
    appId: `${process.env.REACT_APP_APP_ID}`,
    databaseURL: process.env.REACT_APP_DATABASE_URL
}

export const firebaseApp = initializeApp(firebaseConfig)
export const firebaseAuth = getAuth(firebaseApp)
const database = getDatabase(firebaseApp)

const FirebaseContext = createContext(null)

export const useFirebase = () => useContext(FirebaseContext)

export const FirebaseProvider = (props) => {

    const signupUser = (email, password) => {
        return createUserWithEmailAndPassword(firebaseAuth, email, password)
    }

    const signinUser = (email, password) => {
        return signInWithEmailAndPassword(firebaseAuth, email, password)
    }

    const putData = (key, data) => set(ref(database, key), data)

    return (
        <>
            <FirebaseContext.Provider value={{ signupUser, putData, signinUser }}>
                {props.children}
            </FirebaseContext.Provider>
        </>
    )
}