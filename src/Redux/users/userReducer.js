import {
    LOGIN_USER,
    LOGOUT_USER

} from './userTypes'

const initialState = {
    usersList: [{
        id:'1',
        name: 'manager',
        email: 'manager@yopmail.com',
        password: '12345678',
        role: 'manager'
    },
    {
        id:'2',
        name: 'developer',
        email: 'developer@yopmail.com',
        password: '12345678',
        role: 'developer'
    },
    {
        id:'3',
        name: 'qa',
        email: 'qa@yopmail.com',
        password: '12345678',
        role: 'qa'
    }],
    user: null

}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_USER:
            return {
                ...state,
                user: action.payload
            }

        case LOGOUT_USER:
            return {
                ...state,
                user: null
            }

        default:
            return state
    }
}

export default userReducer