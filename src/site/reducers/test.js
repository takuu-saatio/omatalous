import { TEST } from "../actions/test"

export default function status(state = { testVal: "test-def" }, action) {
  switch (action.type) {
    default:
      console.log("init reducer", action);
      if (action.error && action.error.id === "auth_failed") {
        window.location.href = "/home";
        return;
      }
      return state;
  }
}
