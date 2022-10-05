import {
  MANAGE_PROJECT_LIST,
  MANAGE_BUGS_LIST
} from './projectTypes'

export const ManageProjectList = (data) => {
  return {
    type: MANAGE_PROJECT_LIST,
    payload: data
  }
}

export const manageBugsList = (data) => {
  return {
    type: MANAGE_BUGS_LIST,
    payload: data
  }
}