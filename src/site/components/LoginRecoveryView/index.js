import React, { Component, PropTypes } from "react";
import BaseComponent from "../BaseComponent";
import Header from "../Header";
import Feedback from "../Feedback";
import Footer from "../Footer";

class LoginRecovery extends BaseComponent {
  
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    console.log("constr logrec", props);
    this.state = Object.assign(props.state, {
      recoveryParams: {
        email: ""
      }
    });
  }

  _handleInputChange(event) {
    this.state.recoveryParams.email = event.target.value;
    this.setState(this.state); 
  }

  _sendLink() {
    this.props.sendLink(this.state.recoveryParams)
  }

  render() {
     
    console.log("render logrec", this.props, this.state);
    let { recoveryParams } = this.state;

    return (
      <div>
        <Header />
        <div>
          Voit tilata sähköpostiisi kertakäyttöisen kirjautumislinkin. Muista asettaa salasanasi kirjauduttuasi.
        </div>
        <div>
          <div>
            Sähköposti
            <input type="text" 
              name="email" 
              value={this.state.recoveryParams.email}
              onChange={this._handleInputChange.bind(this)} />
          </div>
          <div>
            <button onClick={() => this._sendLink()}>Lähetä</button>
          </div>
        </div>
        <Feedback />
        <Footer />
      </div>
    );
  }

}

export default LoginRecovery;
