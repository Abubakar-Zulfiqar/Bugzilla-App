import { createContext, useContext } from 'react'

import { initializeApp } from 'firebase/app'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { getDatabase, set, ref } from 'firebase/database'

const firebaseConfig = {
    apiKey: 'AIzaSyBvlEs5ocFt9ehSPlBkDPik840nQZ4Vi_Q',
    authDomain: 'bugzilla-app-7491d.firebaseapp.com',
    projectId: 'bugzilla-app-7491d',
    storageBucket: 'bugzilla-app-7491d.appspot.com',
    messagingSenderId: '927231564452',
    appId: '1:927231564452:web:e6d1b7f779dacd81856431',
    databaseURL: 'https://bugzilla-app-7491d-default-rtdb.firebaseio.com/'
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