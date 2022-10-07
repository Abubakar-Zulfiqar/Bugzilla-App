/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { getDatabase, ref, onValue } from 'firebase/database'
import { Button, Card, Grid, TextField, Typography } from '@mui/material'
import ReportIcon from '@mui/icons-material/Report'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'

import { useFirebase } from '../Firebase/Firebase'
import Header from '../Components/Header'

import '../CSS/ManagerScreen.css'

const style = {
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    left: '50%',
    p: 4,
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400
}

const QAScreen = () => {
    const user = useSelector(state => state.user.user)
    const userList = useSelector(state => state.user.userList)
    const projectActions = useSelector(state => state.projects.projects)
    const projectsBugs = useSelector(state => state.projects.bugs)
    const dispatch = useDispatch()

    const db = getDatabase()
    const firebase = useFirebase()

    const [open, setOpen] = useState(false)
    const [projects, setProjects] = useState([])
    const [desc, setDesc] = useState('')
    const [devs, setDevs] = useState([])

    const [deadline, setDeadline] = useState('')

    const [currentProject, setCurrentProject] = useState(null)

    const [assignee, setAssignee] = useState('')

    useEffect(() => {
        const projs = ref(db, 'projects/')
        onValue(projs, (snapshot) => {
            if (snapshot.val()) {
                const data = Object.values(snapshot.val())
                setProjects(data)
            } else {
                setProjects([])
            }
        })

        const users = ref(db, 'users/')
        onValue(users, (snapshot) => {
            if (snapshot.val()) {
                const data = Object.values(snapshot.val())
                let devs = data.filter(e => e.role === 'developer')
                setDevs(devs)
            } else {
                setDevs([])
            }
        })
    }, [db])

    const handleOpen = () => setOpen(true)
    const handleClose = () => {
        setOpen(false)
        setCurrentProject(null)
        setDesc('')
        setDeadline('')
        setAssignee('')
    }

    const reportBug = () => {
        if (desc && assignee && deadline) {
            let id = new Date().getTime()
            let BugsObject = {
                id: id,
                createdBy: user.name,
                projectName: currentProject.name,
                deadline: deadline,
                status: 'Not Resolved',
                description: desc,
                assignee: assignee
            }
            firebase.putData('bugs/' + id, BugsObject)
                .then(() => {
                    setOpen(false)
                    setDesc('')
                    setDeadline('')
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
        <>
            <Header />
            <Grid item xs={2} sx={{ display: 'flex', flexDirection: 'row' }}>
                {
                    projects.filter(e => e.assignee === user.id).map((item, index) => {
                        return (
                            <Card key={index} className='main-content' elevation={9} sx={{ maxWidth: 300 }}>
                                <Grid className='first-content' container>
                                    <Grid item xs={12}>
                                        <p className='logo'>{item.name}</p>
                                        <p>{item.description}</p>
                                    </Grid>

                                    <Grid>
                                        <Button onClick={() => {
                                            setCurrentProject(item)
                                            handleOpen()
                                        }} variant='contained' sx={{ marginLeft: '90px' }}>
                                            <ReportIcon />
                                            <span style={{ marginLeft: '5px' }}>Report Bug</span>
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Card>
                        )
                    })
                }
            </Grid>
            <Modal
                sx={{ color: 'text.primary' }}
                open={open}
                onClose={handleClose}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
            >
                <Box sx={style}>
                    <Typography sx={{ mb: 2 }} id='modal-modal-title' variant='h6' component='h2'>
                        Report a bug
                    </Typography>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <TextField sx={{ mb: 2 }} id='outlined-basic' label='Description' variant='outlined' value={desc} onChange={e => setDesc(e.target.value)} />
                        <TextField sx={{ mb: 2 }} id='outlined-basic' variant='outlined' value={deadline} type='date' onChange={e => setDeadline(e.target.value)} />

                        <select style={{ marginBottom: '10px', width: '54ch', height: '7ch' }} value={assignee} onChange={e => {
                            setAssignee(e.target.value)
                        }}>
                            <option value='' disabled>Assign to:</option>
                            {
                                devs.map((item, index) => {
                                    return (
                                        <option key={index} value={item.id} >{item.name}</option>
                                    )
                                })
                            }
                        </select>
                        <Button onClick={() => dispatch(reportBug())} variant='contained'>Report Bug</Button>
                    </div>
                </Box>
            </Modal>
        </>
    )
}

export default QAScreen