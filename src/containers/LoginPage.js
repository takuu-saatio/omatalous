import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import LoginPage from '../components/LoginPage/LoginPage'
import * as LoginActions from '../actions/login'

function mapStateToProps(state) {
  console.log("lp state", state);
  return {
    status: state.status
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(LoginActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)
