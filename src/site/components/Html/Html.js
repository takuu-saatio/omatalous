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
  
  _trackingCode() {
    return ({ __html:
      `(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
       (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
       m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
       })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
       ga('create', 'UA-74672724-1', 'auto');
       ga('send', 'pageview');`
    });
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
        <link href="/charts.css" rel="stylesheet" type="text/css" />
        <style id="css" dangerouslySetInnerHTML={{ __html: this.props.css }} />
        <script dangerouslySetInnerHTML={this.initialState()} />
        <script dangerouslySetInnerHTML={this.trackingCode()} />
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
