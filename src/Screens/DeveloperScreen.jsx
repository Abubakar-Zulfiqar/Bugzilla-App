/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getDatabase, ref, onValue, set } from 'firebase/database'
import { Button, Card, Grid } from '@mui/material'

import Header from '../Components/Header'

import '../CSS/ManagerScreen.css'

const DeveloperScreen = () => {
    const user = useSelector(state => state.user.user)
    const userList = useSelector(state => state.user.userList)
    const projectActions = useSelector(state => state.projects.projects)
    const projectsBugs = useSelector(state => state.projects.bugs)
    const dispatch = useDispatch()

    const [anchorEl, setAnchorEl] = useState(null)
    const [bugs, setBugs] = useState([])

    const db = getDatabase()

    useEffect(() => {
        const users = ref(db, 'bugs/')
        onValue(users, (snapshot) => {
            if (snapshot.val()) {
                const data = Object.values(snapshot.val())
                let bugs = data.filter(e => e.assignee === user.id)
                setBugs(bugs)
            } else {
                setBugs([])
            }
        })
    }, [db, user.id])

    const open = Boolean(anchorEl)
    const handleClick = (item) => {
        let a = {
            id: item.id,
            createdBy: item.createdBy,
            projectName: item.projectName,
            deadline: item.deadline,
            status: 'Resolved',
            description: item.description,
            assignee: item.assignee

        }
        set(ref(db, `bugs/${item.id}`), a)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    return (
        <>
            <Header />
            <Grid item xs={2} sx={{
                display: 'flex',
                flexDirection: 'row'
            }}>
                {
                    bugs.map((item, index) => {
                        return (
                            <Card key={index} className='main-content' elevation={9} sx={{ maxWidth: 300 }}>
                                <Grid className='first-content' container>
                                    <Grid item xs={12}>
                                        <p style={{ fontSize: 14 }} className='logo'>Bug # {item.id}</p>
                                        <p>This Bug is created by: <span style={{ fontWeight: 'bold' }}>{item.createdBy}</span></p>
                                        <p>This Bug belongs to: <span style={{ fontWeight: 'bold' }}>{item.projectName}</span></p>
                                        <p><span style={{ fontWeight: 'bold' }}>Deadline: </span>{item.deadline}</p>
                                        <p><span style={{ fontWeight: 'bold' }}>Type: </span>{item.description}</p>
                                        <p><span style={{ fontWeight: 'bold' }}>Status: </span><span style={{ color: item.status === 'Resolved' ? 'green' : 'red' }}>{item.status}</span></p>
                                    </Grid>

                                    {item.status !== 'Resolved' &&
                                        <Grid>
                                            <Button
                                                sx={{ marginLeft: '90px' }}
                                                className='demo-customized-button'
                                                aria-controls={open ? 'demo-customized-menu' : undefined}
                                                aria-haspopup='true'
                                                aria-expanded={open ? 'true' : undefined}
                                                variant='contained'
                                                disableElevation
                                                onClick={() => dispatch(handleClick(item))}
                                            >
                                                Mark as Resolve
                                            </Button>
                                        </Grid>}
                                </Grid>
                            </Card>
                        )
                    })
                }
            </Grid>
        </>
    )
}

export default DeveloperScreen