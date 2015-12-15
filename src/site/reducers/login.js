import { LOGIN, REGISTER } from "../actions/login"

const defaultState = {
  status: "initial"
};

export default function status(state = defaultState, action) {
  switch (action.type) {
    case LOGIN:
      return { status: "loggingIn" };
    case REGISTER:
      return { status: "registering" };
    default:
      return state
  }
}
