import React from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client'

import App from './App'
import store from './Redux/store'
import { FirebaseProvider } from './Firebase/Firebase'
import { ColorModeContextProvider } from './Theme/Theme'

import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ColorModeContextProvider>
        <FirebaseProvider>
          <App />
        </FirebaseProvider>
      </ColorModeContextProvider>
    </Provider>
  </React.StrictMode>
)
