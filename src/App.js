import React, { useContext } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import { Button } from '@mui/material'

import { ColorModeContext } from './Theme/Theme'
import { DeveloperScreen, ManagerScreen, QAScreen, SignInScreen, SignUpScreen } from './Screens'

const App = (props) => {

  // eslint-disable-next-line no-unused-vars
  const { mode, toggleMode } = useContext(ColorModeContext)

  return (
    <>
      <Router>
        <Routes>
          {!props.user ? (
            <>
              <Route path='/signin' element={<SignInScreen />} />
              <Route path='*' exact element={<Navigate to='/signin' replace />} />
              <Route path='/signup' element={<SignUpScreen />} />

            </>
          ) : props.user.role === 'manager' ? (
            <>
              <Route path='/manager' element={<ManagerScreen />} />
              <Route path='*' exact element={<Navigate to='/manager' replace />} />
            </>
          ) : props.user.role === 'qa' ? (
            <>
              <Route path='/qa' element={<QAScreen />} />
              <Route path='*' exact element={<Navigate to='/qa' replace />} />
            </>
          ) : props.user.role === 'developer' ? (
            <>
              <Route path='/developer' element={<DeveloperScreen />} />
              <Route path='*' exact element={<Navigate to='/developer' replace />} />
            </>
          ) : (
            alert('No User found against these credentials')
          )
          }
        </Routes>
      </Router>
      <Button variant='contained'
        sx={{
          bgcolor: 'background.default',
          color: 'text.primary',
          textDecoration: 'none',
          display: 'flex',
          position: 'fixed',
          alignItems: 'center',
          justifyContent: 'center',
          top: '10px',
          left: '97vh',
        }} onClick={toggleMode}>
        Change Mode
      </Button>
    </>
  )
}

const mapStateToProps = state => {
  return {
    usersList: state.user.usersList,
    user: state.user.user
  }
}

export default connect(mapStateToProps, null)(App)