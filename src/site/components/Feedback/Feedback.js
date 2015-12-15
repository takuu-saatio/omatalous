import React, { Component } from "react";
import s from "./Feedback.scss";
import withStyles from "../../decorators/withStyles";

@withStyles(s)
class Feedback extends Component {

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <a className={s.link} href="#">Kysy meiltä</a>
          <span className={s.spacer}>|</span>
          <a className={s.link} href="#">Anna palautetta</a>
        </div>
      </div>
    );
  }

}

export default Feedback;
