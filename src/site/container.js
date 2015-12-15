import { bindActionCreators } from "redux";
import { connect } from "react-redux";

export default function container(component, actions, reducer) {
  
  let mapStateToProps = function(state) {
    return {
      state: state[reducer]
    };
  };

  let mapDispatchToProps = function(dispatch) {
    return bindActionCreators(actions, dispatch)
  };

  return connect(mapStateToProps, mapDispatchToProps)(component);

}
