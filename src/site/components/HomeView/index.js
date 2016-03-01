import React, { Component, PropTypes } from "react";
import s from "./HomeView.scss";
import withStyles from "../../decorators/withStyles";
import RaisedButton from "material-ui/lib/raised-button";
import BaseComponent from "../BaseComponent";
import Location from "../../../core/Location";

@withStyles(s)
class HomeView extends BaseComponent {
  
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    console.log("constr home", props);
    this.state = props.state;
  }

  _renderUnauthenticated() {
    return (
      <div className={s.root}>
        <div className={s.banner}>
          <div className={s.smallHeading}>Takuu-Säätio</div>
          <div className={s.bigHeading}>Penno.fi</div>
        </div>
        <div className={s.content}>
          <RaisedButton style={{ position: "absolute", top: "-18px", left: "calc(50% - 75px)" }} 
            onTouchTap={() => Location.go("/login")}
            label="Kirjaudu sisään" secondary={true} />
          <p>
            Penno auttaa sinua hallitsemaan talouttasi paremmin.
          </p>
        </div>
      </div>
    );
  }

  render() {

    console.log("render home", this.props, this.state);
    
    let auth = this.state.auth;
    let loginButton = !(auth && auth.user) ?
      (<RaisedButton 
          style={{ position: "absolute", top: "-18px", left: "calc(50% - 75px)" }} 
          onTouchTap={() => Location.go("/login")}
          label="Kirjaudu sisään" secondary={true} />) : null;
   
    return (
      <div className={s.root}>
        <div className={s.banner}>
          <div className={s.smallHeading}>Takuu-Säätio</div>
          <div className={s.bigHeading}>Penno.fi</div>
        </div>
        <div className={s.content}>
          {loginButton}
          <p>
            Penno auttaa sinua hallitsemaan talouttasi paremmin.
          </p>
        </div>
      </div>
    );
    return (
      <div>
        {content}
      </div>
    );

  }

}

export default HomeView;
