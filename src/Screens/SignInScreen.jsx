import React, { useState } from 'react'
import { connect } from 'react-redux'

import { getDatabase, ref, child, get } from 'firebase/database'
import { Button, Card, Grid, Link, TextField } from '@mui/material'

import { LoginUser } from '../Redux/users/userActions'
import { useFirebase } from '../Firebase/Firebase'


import '../CSS/LoginScreen.css'

const SignInScreen = (props) => {
    const firebase = useFirebase()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onLogin = () => {
        if (email && password) {
            firebase.signinUser(email, password).then(res => {
                alert('res in signin', res)
                let id = res._tokenResponse.localId

                const dbRef = ref(getDatabase())
                get(child(dbRef, `users/${id}`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        alert('user data', snapshot.val())
                        let user = snapshot.val()
                        props.LoginUser(user)
                    } else {
                        alert('no data avialable')
                    }
                }).catch((error) => {
                    alert(error)
                })
            }).catch(err => {
                alert('err on signin', err.message)
                alert(err.message)
            })
        } else {
            alert('incomplete credentials')
        }
    }
    return (
        <>
            <Card className='main' elevation={9} sx={{ maxWidth: 300, mt: 10 }}>
                <Grid className='content' container rowSpacing={2} >
                    <Grid item xs={12}>
                        <p className='logo'>
                            <Link href='/' underline='none' sx={{ textShadow: '1px 1px 2px black' }}>Bugzilla</Link>
                        </p>
                        <p>Bug fixer</p>
                    </Grid>

                    <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <TextField
                            onChange={(e) => {
                                setEmail(e.target.value)
                            }} value={email}
                            className='outlined-required' label='Enter Email Address' type='email' variant='outlined' required />
                        <TextField
                            onChange={(e) => {
                                setPassword(e.target.value)
                            }} value={password}
                            className='outlined-required' label='Password' type='password' variant='outlined' required />
                    </Grid>

                    <Grid item xs={12}>
                        <Button onClick={() => onLogin()} type='submit' variant='contained'>Sign in</Button>
                    </Grid>

                    <Grid item xs={12}>
                        Not Have an account  <Link href='/signup'> Sign Up</Link>
                    </Grid>
                </Grid>
            </Card>
        </>
    )
}

const mapStateToProps = state => {
    return {
        usersList: state.user.usersList,
        user: state.user.user
    }
}
const mapDispathToProps = dispatch => {
    return {
        LoginUser: (data) => dispatch(LoginUser(data)),
    }
}

export default connect(mapStateToProps, mapDispathToProps)(SignInScreen)