import React, { useState } from 'react'
import { connect } from 'react-redux'

import { Button, Card, Grid, Link, TextField } from '@mui/material'

import { useFirebase } from '../Firebase/Firebase'
import { LoginUser } from '../Redux/users/userActions'

import '../CSS/LoginScreen.css'

const SignUpScreen = (props) => {

    const firebase = useFirebase()

    const [email, setEmail] = useState('')
    const [name, setName] = useState('')

    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')

    const onSignup = () => {
        if (email && password && name) {
            firebase.signupUser(email, password).then(res => {
                let id = res._tokenResponse.localId
                // eslint-disable-next-line no-unused-vars
                let user = {
                    id: id,
                    name: name,
                    email: res._tokenResponse.email,
                    // password: '12345678',
                    role: role
                }
                firebase.putData('users/' + id, { id, email, name, role })
                    .then(res => {
                        props.LoginUser({ id, email, name, role })
                    })
                    .catch(err => {
                    })
            }).catch(err => {
                alert(err.message)
            })
        } else {
            alert('missing info')
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
                            onChange={(e) => { setEmail(e.target.value) }} value={email}
                            className='outlined-required' label='Enter Email Address' type='email' variant='outlined' required />
                        <TextField
                            onChange={(e) => { setName(e.target.value) }} value={name}
                            className='outlined-required' label='Enter Name' type='text' variant='outlined' required />
                        <TextField
                            onChange={(e) => { setPassword(e.target.value) }} value={password}
                            className='outlined-required' label='Password' type='password' variant='outlined' required />
                    </Grid>

                    <select style={{ marginTop: '20px', marginBottom: '10px', width: '54ch', height: '7ch' }} value={role}
                        onChange={e => { setRole(e.target.value) }}>
                        <option value='' disabled>Select Role</option>
                        <option value='manager'>Manager</option>
                        <option value='developer'>Developer</option>
                        <option value='qa'>QA</option>
                    </select>

                    <Grid item xs={12}>
                        <Button
                            onClick={() => onSignup()} type='submit' variant='contained'>
                            Sign Up
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        Already Have an account  <Link href='/signin'> Sign In</Link>
                    </Grid>
                </Grid>
            </Card>
        </>
    )
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        userList: state.user.usersList,
        projects: state.projects.projects
    }
}
const mapDispathToProps = dispatch => {
    return {
        LoginUser: (data) => dispatch(LoginUser(data)),
    }
}

export default connect(mapStateToProps, mapDispathToProps)(SignUpScreen)