import { LOGIN, REGISTER } from "../actions/login"

let defaultState = {
  title: "LETS GO",
  content: "dolorem"
};

export default function status(state = defaultState, action) {
  switch (action.type) {
    case LOGIN:
      return { title: "HEY", content: "lorem" };
    case REGISTER:
      return { title: "HO", content: "ipsum" };
    default:
      return state;
  }
}
