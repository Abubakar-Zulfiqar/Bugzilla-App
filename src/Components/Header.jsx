import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { getDatabase, ref, child, get } from 'firebase/database'

import { AppBar, Toolbar, Typography, Container, TextField, Button } from '@mui/material'
import AdbIcon from '@mui/icons-material/Adb'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'

import { LogoutUser } from '../Redux/users/userActions'
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
const Header = () => {
    const user = useSelector(state => state.user.user)
    // eslint-disable-next-line no-unused-vars
    const userList = useSelector(state => state.user.userList)
    // eslint-disable-next-line no-unused-vars
    const projectActions = useSelector(state => state.projects.projects)
    const dispatch = useDispatch()

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
                let array = Object.values(users)
                let qaArray = array.filter(e => e.role === 'qa')
                setQa(qaArray)
                //   props.LoginUser(user)
            } else {
                alert('No data available')
            }
        }).catch((error) => {
            alert(error)
        })
    }, [dbRef])

    const handleOpen = () => setOpen(true)
    const handleClose = () => {
        setOpen(false)
        setName('')
        setDesc('')
        setAssignee('')
    }
    const logout = () => LogoutUser()
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
                    setOpen(false)
                    setName('')
                    setDesc('')
                    setAssignee('')
                })
                .catch(err => {
                    alert('err on putting data', err)
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

                        {user.role === 'manager' && <Button onClick={handleOpen} variant='contained'>Create Project</Button>}
                        <Button style={{ marginLeft: 10 }} onClick={() => dispatch(logout())} variant='contained'>Logout</Button>

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
                                    <Button onClick={() => dispatch(addProject())} variant='contained'>Add project</Button>
                                </div>
                            </Box>
                        </Modal>
                    </Toolbar>
                </Container>
            </AppBar>
        </Box>
    )
}

export default Header