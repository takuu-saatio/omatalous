import React, { Component, PropTypes } from "react";
import s from "./LoginRecoveryView.scss";
import withStyles from "../../decorators/withStyles";
import TextField from "material-ui/lib/text-field";
import FlatButton from "material-ui/lib/flat-button";
import BaseComponent from "../BaseComponent";

@withStyles(s)
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
        <div className={s.description}>Kertakäyttöinen kirjautumislinkki lähetetty sähköpostissa!</div>
      );
    } else {
      viewContent = (
        <div>
          <div className={s.description}>
            Voit tilata sähköpostiisi kertakäyttöisen kirjautumislinkin. Muista asettaa salasanasi kirjauduttuasi.
          </div>
          <div>
            <div className={s.form}>
              <div className={s.input}>
                <TextField style={{ width: "100%" }}
                  name="email" 
                  floatingLabelText="Sähköposti"
                  value={this.state.recoveryParams.email}
                  onChange={this._handleInputChange.bind(this)} />
              </div>
              <div className={s.button}>
                <FlatButton onClick={() => this._sendLink()} label="Lähetä" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className={s.root}>
          {viewContent}
        </div>
      </div>
    );
  }

}

export default LoginRecovery;
