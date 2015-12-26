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
    let { recoveryParams, status, error } = this.state;

    let viewContent = null;

    if (status === "email_sent") {
      viewContent = (
        <div>Kertakäyttöinen kirjautumislinkki lähetetty sähköpostissa!</div>
      );
    } else {
      viewContent = (
        <div>
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
        </div>
      );
    }

    return (
      <div>
        <Header />
          {viewContent}
        <Feedback />
        <Footer />
      </div>
    );
  }

}

export default LoginRecovery;
