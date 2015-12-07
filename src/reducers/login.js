import { LOGIN, REGISTER } from '../actions/login'

export default function status(state = 'initial', action) {
  switch (action.type) {
    case LOGIN:
      return 'loggingIn'
    case REGISTER:
      return 'registering'
    default:
      return state
  }
}
