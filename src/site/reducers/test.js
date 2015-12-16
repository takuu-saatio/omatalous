import { TEST } from "../actions/test"

export default function status(state = { testVal: "test-def" }, action) {
  switch (action.type) {
    case TEST:
      return { testVal: "test-testing" };
    default:
      return state
  }
}
