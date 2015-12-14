import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import ContentPage from "../components/ContentPage/ContentPage"
import * as LoginActions from "../actions/login"

function mapStateToProps(state) {
  console.log("lp container, state:", state);
  return {
    state: state
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(LoginActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentPage)
