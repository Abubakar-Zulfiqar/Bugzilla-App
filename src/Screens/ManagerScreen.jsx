/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'

import { getDatabase, ref, onValue, set } from 'firebase/database'
import { Button, Card, Grid } from '@mui/material'

import { ManageProjectList } from '../Redux/projects/projectActions'
import Header from '../Components/Header'

import '../CSS/ManagerScreen.css'

const ManagerScreen = () => {
    const user = useSelector(state => state.user.user)
    const userList = useSelector(state => state.user.userList)
    const projectActions = useSelector(state => state.projects.projects)
    const dispatch = useDispatch()

    const [anchorEl, setAnchorEl] = useState(null)
    const [projects, setProjects] = useState([])

    const open = Boolean(anchorEl)
    const db = getDatabase()

    useEffect(() => {
        const projs = ref(db, 'projects/')
        onValue(projs, (snapshot) => {
            if (snapshot.val()) {
                const data = Object.values(snapshot.val())
                console.log('projectsss->', data)
                setProjects(data)
            } else {
                console.log('no project')
                setProjects([])
            }
        })
    }, [db])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const deleteProject = (project) => {
        console.log('ksdjfljsf', project)
        set(ref(db, `projects/${project.id}`), {

        })
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
                    projects.map((item, index) => {
                        let a = item
                        return (
                            <Card key={index} className='main-content' elevation={9} sx={{ maxWidth: 300 }}>
                                <Grid className='first-content' container>
                                    <Grid item xs={12}>
                                        <p className='logo'>{item.name}</p>
                                        <p>{item.description}</p>
                                        <p> assigned to: <b>{item.assigneeName}</b></p>
                                    </Grid>

                                    <Button
                                        sx={{ marginLeft: '90px' }}
                                        className='demo-customized-button'
                                        aria-controls={open ? 'demo-customized-menu' : undefined}
                                        aria-haspopup='true'
                                        aria-expanded={open ? 'true' : undefined}
                                        variant='contained'
                                        disableElevation
                                        onClick={() => dispatch(deleteProject(item))}
                                    >
                                        Delete
                                    </Button>
                                </Grid>
                            </Card>
                        )
                    })
                }
            </Grid>
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
        manageProjectsList: (data) => dispatch(ManageProjectList(data))
    }
}

export default connect(mapStateToProps, mapDispathToProps)(ManagerScreen)