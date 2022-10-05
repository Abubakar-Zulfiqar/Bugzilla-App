import { createStore, combineReducers } from 'redux'

import projectReducer from './projects/projectReducer'
import userReducer from './users/userReducer'

const RootReducer = combineReducers({
  user: userReducer,
  projects: projectReducer
});

const store = createStore(RootReducer)

export default store