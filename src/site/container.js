import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as RoutingActions from "./actions/routing";

export default function container(component, actions, reducer) {
  
  let mapStateToProps = function(state) {
    return {
      state: Object.assign(reducer ? state[reducer] : {}, { auth: state.auth, routing: state.routing }) 
    };
  };

  let mapDispatchToProps = function(dispatch) {
    return bindActionCreators(Object.assign(RoutingActions, actions), dispatch)
  };

  return connect(mapStateToProps, mapDispatchToProps)(component);

}
