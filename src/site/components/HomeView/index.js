import React, { Component, PropTypes } from "react";
import BaseComponent from "../BaseComponent";
import Header from "../Header";
import Feedback from "../Feedback";
import Footer from "../Footer";

class HomeView extends BaseComponent {
  
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    console.log("constr home", props);
    this.state = props.state;
  }

  _renderAuthenticated() {
    
    const { doTest } = this.props;
    
    return (
      <div>
        <div>
          <h1>Tulot</h1>
          <p>123456</p>
          <h1>Menot</h1>
          <p>654321</p>
          <h1>State val</h1>
          <p>{this.state.homeVal}</p>
          <button onClick={() => doTest()}>Test</button>
        </div>
      </div>
    );
  }

  _renderUnauthenticated() {
    return (
      <div>
        <div>
          <h1>Aloita säästäminen!</h1>
          <p>
            Omatalous-sovellus auttaa sinua hallitsemaan talouttasi paremmin!
            Päästäksesi alkuun sinun tulee <a href="/login">kirjautua sisään</a> sovellukseen.
          </p>
        </div>
      </div>
    );
  }

  render() {

    console.log("render home", this.props, this.state);
    
    let auth = this.state.auth;
    let content = (auth && auth.user) ?
      this._renderAuthenticated() : this._renderUnauthenticated();
   
    return (
      <div>
        <Header auth={auth}/>
        {content}
        <Feedback />
        <Footer />
      </div>
    );

  }

}

export default HomeView;
