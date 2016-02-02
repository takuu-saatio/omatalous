import React, { Component, PropTypes } from "react";
import config from "../../../config";
import { render } from "react-dom"
import { Provider } from "react-redux"

class Html extends Component {

  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    css: PropTypes.string,
    body: PropTypes.string.isRequired,
    entry: PropTypes.string.isRequired,
  };

  static defaultProps = {
    title: "",
    description: "",
  };
  
  trackingCode() {
    /*
        <script dangerouslySetInnerHTML={this.trackingCode()} />
    return ({ __html:
      `(function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=` +
      `function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;` +
      `e=o.createElement(i);r=o.getElementsByTagName(i)[0];` +
      `e.src='https://www.google-analytics.com/analytics.js';` +
      `r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));` +
      `ga('create','${config.googleAnalyticsId}','auto');ga('send','pageview');`,
      });
      */
     return null;
  }
  
  initialState() {
    return ({ __html:
      `window.__INITIAL_STATE__ = ${JSON.stringify(this.props.initialState)};
       window.__INTL_DATA__ = ${JSON.stringify(this.props.intlData)};`
    });
  }

  render() {
    
    let intlPolyfill = null;
    
    const { userAgent } = this.props;  
    console.log("HTML USER AGENT", userAgent);
    const doPolyfill = 
      (userAgent.indexOf("Safari") !== -1 && userAgent.indexOf("Chrome") === -1) ||
       userAgent.indexOf("Windows NT") !== -1;
    if (doPolyfill) {
      intlPolyfill = (
        <script src="/polyfill.js"></script>
      );
    }

    return (
      <html className="no-js" lang="">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <title>{this.props.title}</title>
        <meta name="description" content={this.props.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="/c3.min.css" rel="stylesheet" type="text/css" />
        <link rel="apple-touch-icon" href="apple-touch-icon.png" />
        <link href="/fonts.css" rel="stylesheet" type="text/css" />
        <style id="css" dangerouslySetInnerHTML={{ __html: this.props.css }} />
        <script dangerouslySetInnerHTML={this.initialState()} />
        {intlPolyfill}
      </head>
      <body>
        <div id="app" dangerouslySetInnerHTML={{ __html: this.props.body }} />
        <script src={this.props.entry}></script>
      </body>
      </html>
    );
  }

}

export default Html;
