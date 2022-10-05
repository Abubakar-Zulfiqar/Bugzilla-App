import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { getDatabase, ref, child, get } from 'firebase/database'

import { AppBar, Toolbar, Typography, Container, TextField, Button } from '@mui/material'
import AdbIcon from '@mui/icons-material/Adb'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'

import { LogoutUser } from '../Redux/users/userActions'
import { ManageProjectList } from '../Redux/projects/projectActions'
import { useFirebase } from '../Firebase/Firebase'

const style = {
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    left: '50%',
    p: 4,
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    color: 'text.primary',
}
const Header = (props) => {

    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')

    const [desc, setDesc] = useState('')
    const [assignee, setAssignee] = useState('')
    const [qa, setQa] = useState([])

    const firebase = useFirebase()
    const dbRef = ref(getDatabase())

    useEffect(() => {
        get(child(dbRef, `users/`)).then((snapshot) => {
            if (snapshot.exists()) {
                let users = snapshot.val()
                console.log('users', users)
                let array = Object.values(users)
                let qaArray = array.filter(e => e.role === 'qa')
                console.log('qa array', qaArray)
                setQa(qaArray)
                //   props.LoginUser(user)
            } else {
                console.log('No data available')
            }
        }).catch((error) => {
            console.error(error)
        })
    }, [dbRef])

    const handleOpen = () => setOpen(true)
    const handleClose = () => {
        setOpen(false)
        setName('')
        setDesc('')
        setAssignee('')
    }
    const logout = () => props.LogoutUser()
    const addProject = () => {
        if (name && desc && assignee) {
            let id = new Date().getTime()
            let projectObject = {
                id: id,
                name: name,
                description: desc,
                assignee: assignee,
                assigneeName: qa.filter(e => e.id === assignee)[0].name
                // assigneeN
            }
            firebase.putData('projects/' + id, projectObject)
                .then(() => {
                    console.log('res on putting data projects->')
                    setOpen(false)
                    setName('')
                    setDesc('')
                    setAssignee('')
                })
                .catch(err => {
                    console.log('err on putting data', err)
                    alert('err on putting data in signup')
                })
        } else {
            alert('missing information')
        }
    }

    return (
        <Box>
            <AppBar position='static'>
                <Container maxWidth='xl'>
                    <Toolbar disableGutters>
                        <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                        <Typography variant='h6' noWrap component='p'
                            sx={{
                                flexGrow: 1, mr: 2, display: { xs: 'none', md: 'flex' }, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.3rem', color: 'inherit', textDecoration: 'none'
                            }}
                        >
                            Bugzilla
                        </Typography>

                        {props.user.role === 'manager' && <Button onClick={handleOpen} variant='contained'>Create Project</Button>}
                        <Button style={{ marginLeft: 10 }} onClick={logout} variant='contained'>Logout</Button>

                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby='modal-modal-title'
                            aria-describedby='modal-modal-description'
                        >
                            <Box sx={style}>
                                <Typography id='modal-modal-title' variant='h6' component='h2'>
                                    Add a project
                                </Typography>
                                <Typography id='modal-modal-description' sx={{ mt: 2, mb: 2 }}>
                                    Project Description
                                </Typography>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <TextField sx={{ mb: 2 }} id='outlined-basic' label='Name' variant='outlined' value={name} onChange={e => setName(e.target.value)} />
                                    <TextField sx={{ mb: 2 }} id='outlined-basic' label='Description' variant='outlined' value={desc} onChange={e => setDesc(e.target.value)} />
                                    <select style={{ marginBottom: '10px', width: '54ch', height: '7ch' }} value={assignee} onChange={e => {
                                        setAssignee(e.target.value)
                                    }}>
                                        <option value='' disabled>Select Assignee QA</option>
                                        {
                                            qa.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.id} >{item.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                    <Button onClick={addProject} variant='contained'>Add project</Button>
                                </div>
                            </Box>
                        </Modal>
                    </Toolbar>
                </Container>
            </AppBar>
        </Box>
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
        LogoutUser: () => dispatch(LogoutUser()),
        manageProjectsList: (data) => dispatch(ManageProjectList(data))
    }
}

export default connect(mapStateToProps, mapDispathToProps)(Header)