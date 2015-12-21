import React, { Component, PropTypes } from "react";
import BaseComponent from "../BaseComponent";
import Header from "../Header";
import Feedback from "../Feedback";
import Footer from "../Footer";

class Test extends BaseComponent {
  
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    console.log("constr test", props);
    this.state = props.state;
  }
 
  render() {
    
    const { doTest, test } = this.props;
    
    console.log("render test", this.props, this.state);

    return (
      <div>
        <div>
          <Header />
          <h1>{this.state.testVal}</h1>
          <button onClick={() => doTest()}>Test</button>
          <Feedback />
          <Footer />
        </div>
      </div>
    );
  }

}

export default Test;
