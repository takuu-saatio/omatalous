import request from "superagent";
import React, { Component, PropTypes } from "react";
import s from "./ContentPage.scss";
import withStyles from "../../decorators/withStyles";

@withStyles(s)
class ContentPage extends Component {
  
  constructor(props) {
    super(props);
    this.state = props.state;
    console.log("content props", props);
  }

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  componentWillMount() {
    //this.context.onSetTitle(title);
    /*
    if (!this.state.login) {
      this.fetchData();
      }
      */
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.state);
  }
  
  /*
  fetchData() {
    
    request
      .get("/api/login")
      .accept("application/json")
      .end((err, res) => {
        
        if (err) {
          console.log("Error:", err);
          return;
        }
        
        var response = res.body;
        console.log("response", response);

        this.setState(response.login);

      });

  }
  */

  render() {
    
    console.log("render lp, props: ", this.props);
    
    return (
      <div className={s.root}>
        <div className={s.container}>
          <div dangerouslySetInnerHTML={{ __html: "<div>this.props.content</div>" || "" }} />
        </div>
      </div>
    );
  }

}

export default ContentPage;
