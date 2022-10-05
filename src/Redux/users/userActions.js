import {
  LOGIN_USER,
  LOGOUT_USER
} from './userTypes'

export const LoginUser = (data) => {
  return {
    type: LOGIN_USER,
    payload: data
  }
}

export const LogoutUser = () => {
  return {
    type: LOGOUT_USER,
  }
}