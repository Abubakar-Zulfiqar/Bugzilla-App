import {
    MANAGE_PROJECT_LIST,
    MANAGE_BUGS_LIST
} from './projectTypes'

const initialState = {
    projects: [],
    bugs: []
}

const projectReducer = (state = initialState, action) => {
    switch (action.type) {
        case MANAGE_PROJECT_LIST:
            return {
                ...state,
                projects: action.payload
            }
        case MANAGE_BUGS_LIST:
            return {
                ...state,
                bugs: action.payload
            }

        default:
            return state
    }
}

export default projectReducer